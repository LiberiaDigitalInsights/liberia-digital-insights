import { Router } from "express";
import multer from "multer";
import { supabase } from "../supabaseClient.js";

const router = Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept audio and video files
    const allowedTypes = [
      'audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/m4a', 'audio/mp4', 'audio/x-m4a', 'audio/ogg',
      'video/mp4', 'video/webm', 'video/ogg'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio and video files are allowed.'), false);
    }
  }
});

// Handle file uploads
router.post("/upload", upload.single('file'), async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('File:', req.file);
    
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { type = 'misc' } = req.body;
    const file = req.file;
    
    console.log('Processing file:', file.originalname, 'Type:', type, 'MIME:', file.mimetype);
    
    // Determine folder based on file type
    let folder = type;
    if (file.mimetype.startsWith('audio/')) {
      folder = 'audio';
    } else if (file.mimetype.startsWith('video/')) {
      folder = 'video';
    }

    // Generate unique filename
    const ext = file.originalname.split('.').pop().toLowerCase();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const path = `${folder}/${filename}`;

    console.log('Uploading to Supabase bucket:', path);

    // Try to use specified bucket, fallback to default if it doesn't exist
    let bucket = process.env.SUPABASE_STORAGE_BUCKET || "uploads";
    let uploadError = null;
    let retryCount = 0;
    const maxRetries = 3;

    // Retry upload with exponential backoff
    while (retryCount < maxRetries) {
      try {
        console.log(`Upload attempt ${retryCount + 1}/${maxRetries}`);
        
        // Configure Supabase client with longer timeout
        const supabaseOptions = {
          auth: {
            persistSession: false
          },
          db: {
            schema: 'public'
          },
          global: {
            headers: {},
            fetch: (url, options = {}) => {
              return fetch(url, {
                ...options,
                // Increase timeout to 60 seconds for large files
                signal: AbortSignal.timeout(60000)
              });
            }
          }
        };

        const { error } = await supabase.storage
          .from(bucket)
          .upload(path, file.buffer, { 
            contentType: file.mimetype,
            upsert: false 
          });
        
        uploadError = error;
        
        if (!error) {
          console.log('Upload successful!');
          break; // Success, exit retry loop
        }
        
        console.log(`Upload attempt ${retryCount + 1} failed:`, error.message);
        
      } catch (err) {
        console.error(`Upload attempt ${retryCount + 1} error:`, err);
        uploadError = err;
      }
      
      retryCount++;
      
      if (retryCount < maxRetries) {
        // Exponential backoff: 2s, 4s, 8s
        const delay = Math.pow(2, retryCount) * 1000;
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // If bucket doesn't exist, try default bucket
    if (uploadError && bucket !== 'uploads') {
      console.log('Trying default "uploads" bucket...');
      bucket = 'uploads';
      
      for (let i = 0; i < maxRetries; i++) {
        try {
          const { error } = await supabase.storage
            .from(bucket)
            .upload(path, file.buffer, { 
              contentType: file.mimetype,
              upsert: false 
            });
          uploadError = error;
          
          if (!error) {
            console.log('Upload successful with default bucket!');
            break;
          }
          
          if (i < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        } catch (err) {
          uploadError = err;
        }
      }
    }

    // If still failing, try creating the bucket
    if (uploadError && uploadError.message?.includes('bucket') && bucket === 'uploads') {
      console.log('Trying to create uploads bucket...');
      try {
        await supabase.storage.createBucket('uploads', {
          public: true,
          allowedMimeTypes: ['*'],
          fileSizeLimit: 104857600 // 100MB
        });
        
        // Retry upload after creating bucket
        const { error } = await supabase.storage
          .from(bucket)
          .upload(path, file.buffer, { 
            contentType: file.mimetype,
            upsert: false 
          });
        uploadError = error;
      } catch (createError) {
        console.error('Failed to create bucket:', createError);
      }
    }

    if (uploadError) {
      console.error('All upload attempts failed:', uploadError);
      return res.status(500).json({ 
        error: `Upload failed after ${maxRetries} attempts: ${uploadError.message}` 
      });
    }

    console.log('Upload successful, getting public URL');

    // Get public URL
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    
    console.log('Public URL:', data?.publicUrl);
    
    return res.json({ 
      path, 
      url: data?.publicUrl || null,
      filename: file.originalname,
      size: file.size,
      type: file.mimetype
    });

  } catch (error) {
    console.error('Upload error:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ error: "Upload failed: " + error.message });
  }
});

// Keep the old base64 upload endpoint for backward compatibility
router.post("/base64", async (req, res) => {
  try {
    const { dataUrl, folder = "misc" } = req.body || {};
    if (!dataUrl?.startsWith("data:"))
      return res.status(400).json({ error: "Invalid dataUrl" });
    const m = dataUrl.match(/^data:([^;]+);base64,(.*)$/);
    if (!m) return res.status(400).json({ error: "Malformed dataUrl" });
    const mime = m[1];
    const buf = Buffer.from(m[2], "base64");
    const ext = (mime.split("/")[1] || "bin").toLowerCase();
    const path = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "uploads";
    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, buf, { contentType: mime });
    if (error) return res.status(500).json({ error: error.message });
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return res.json({ path, url: data?.publicUrl || null });
  } catch (e) {
    return res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
