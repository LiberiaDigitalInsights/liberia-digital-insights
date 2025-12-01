import { Router } from "express";
import { supabase } from "../supabaseClient.js";

const router = Router();

router.post("/upload", async (req, res) => {
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
