import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

// Get all categories
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching categories:", error);
      return res.status(500).json({ error: "Failed to fetch categories" });
    }

    res.json({ data, pagination: { total: data.length } });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get category by slug
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Category not found" });
      }
      console.error("Error fetching category:", error);
      return res.status(500).json({ error: "Failed to fetch category" });
    }

    res.json({ data });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
