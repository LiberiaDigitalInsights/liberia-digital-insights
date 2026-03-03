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

// Helper function to upload file to Supabase
async function uploadFileToSupabase(file, folder) {
  if (!file) return null;
  
  const ext = file.originalname.split('.').pop().toLowerCase();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const path = `${folder}/${filename}`;
  
  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(path, file.buffer, { 
      contentType: file.mimetype,
      upsert: false 
    });
  
  if (error) throw error;
  
  const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(path);
  return urlData?.publicUrl;
}

// GET /v1/podcasts - Get all podcasts
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, status = "published", search } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("podcasts")
      .select("*", { count: "exact" })
      .eq("status", status)
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      podcasts: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /v1/podcasts/slug/:slug - Get single podcast by slug
router.get("/slug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const { data, error } = await supabase
      .from("podcasts")
      .select("*")
      .eq("slug", slug)
      .limit(1);

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Podcast not found" });
    }

    res.json({ podcast: data[0] });
  } catch (error) {
    console.error("Route error:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET /v1/podcasts/:id - Get single podcast
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("podcasts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Podcast not found" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /v1/podcasts - Create new podcast
router.post("/", upload.fields([{ name: 'audio_file', maxCount: 1 }, { name: 'cover_image', maxCount: 1 }]), async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      transcript,
      video_url,
      youtube_url,
      facebook_url,
      spotify_url,
      apple_podcasts_url,
      duration,
      episode_number,
      season_number,
      status = "draft",
      published_at,
      tags,
    } = req.body;

    // Handle file uploads
    const audioFile = req.files?.audio_file?.[0];
    const coverImageFile = req.files?.cover_image?.[0];
    
    let audio_url = req.body.audio_url; // Keep existing URL if provided
    let cover_image_url = req.body.cover_image_url; // Keep existing URL if provided
    
    // Upload audio file if provided
    if (audioFile) {
      console.log('Uploading audio file:', audioFile.originalname);
      audio_url = await uploadFileToSupabase(audioFile, 'audio');
    }
    
    // Upload cover image if provided
    if (coverImageFile) {
      console.log('Uploading cover image:', coverImageFile.originalname);
      cover_image_url = await uploadFileToSupabase(coverImageFile, 'images');
    }

    // Parse tags from JSON string or use empty array
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (e) {
        console.warn('Invalid tags format, using empty array');
      }
    }

    const { data, error } = await supabase
      .from("podcasts")
      .insert([
        {
          title,
          slug,
          description,
          audio_url,
          transcript,
          video_url,
          youtube_url,
          facebook_url,
          spotify_url,
          apple_podcasts_url,
          cover_image_url,
          duration,
          episode_number,
          season_number,
          status,
          published_at: status === "published" ? published_at || new Date().toISOString() : null,
          tags: parsedTags,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Podcast creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /v1/podcasts/:id - Update podcast
router.put("/:id", upload.fields([{ name: 'audio_file', maxCount: 1 }, { name: 'cover_image', maxCount: 1 }]), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Handle file uploads
    const audioFile = req.files?.audio_file?.[0];
    const coverImageFile = req.files?.cover_image?.[0];
    
    // Upload new audio file if provided
    if (audioFile) {
      console.log('Uploading new audio file:', audioFile.originalname);
      updates.audio_url = await uploadFileToSupabase(audioFile, 'audio');
    }
    
    // Upload new cover image if provided
    if (coverImageFile) {
      console.log('Uploading new cover image:', coverImageFile.originalname);
      updates.cover_image_url = await uploadFileToSupabase(coverImageFile, 'images');
    }

    // Parse tags from JSON string if provided
    if (updates.tags) {
      try {
        updates.tags = typeof updates.tags === 'string' ? JSON.parse(updates.tags) : updates.tags;
      } catch (e) {
        console.warn('Invalid tags format, using empty array');
        updates.tags = [];
      }
    }

    if (updates.status === "published" && !updates.published_at) {
      updates.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("podcasts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Podcast not found" });
    }

    res.json(data);
  } catch (error) {
    console.error('Podcast update error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /v1/podcasts/:id - Delete podcast
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("podcasts").delete().eq("id", id);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
