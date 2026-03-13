import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";
import { v4 as uuidv4 } from "uuid";

// POST /api/v1/upload - Upload a file to Supabase Storage
async function postHandler(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const path = formData.get("path") || "misc";
    const type = formData.get("type") || "images";
    // Use the bucket from env if available, otherwise fallback to 'uploads'
    // Legacy system uses a single bucket defined in SUPABASE_STORAGE_BUCKET
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "uploads";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const fileExtension = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = `${path}/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("[api/upload] Supabase upload error:", error);
      throw error;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return NextResponse.json({
      path: data.path,
      url: publicUrlData.publicUrl,
      filename: fileName,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("[api/upload] POST error:", error);
    return NextResponse.json(
      { error: "Upload failed: " + error.message },
      { status: 500 },
    );
  }
}

// Support both admin and editor roles for uploads
export const POST = withAuth(postHandler, ["admin", "editor"]);
