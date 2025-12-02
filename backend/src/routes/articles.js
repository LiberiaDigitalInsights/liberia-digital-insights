import { Router } from "express";
import { supabase } from "../supabaseClient.js";

const router = Router();

// GET /v1/articles - Get all articles (with pagination and filtering)
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, status = "published", category, search } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("articles")
      .select(`
        *,
        categories(name, slug),
        users(first_name, last_name, email)
      `, { count: "exact" })
      .eq("status", status)
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq("categories.slug", category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    // Transform the data to match frontend expectations
    const transformedData = data.map(article => ({
      ...article,
      category: article.categories ? (Array.isArray(article.categories) ? article.categories[0] : article.categories) : null,
      categories: undefined // Remove the original categories property
    }));

    res.json({
      articles: transformedData,
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

// GET /v1/articles/slug/:slug - Get single article by slug
router.get("/slug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const { data, error } = await supabase
      .from("articles")
      .select(`
        *,
        categories(name, slug),
        users(first_name, last_name, email)
      `)
      .eq("slug", slug)
      .limit(1);

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Article not found" });
    }

    // Increment view count
    await supabase.rpc("increment_view_count", { table_name: "articles", record_id: data[0].id });

    // Transform the data to match frontend expectations
    const article = data[0];
    const transformedArticle = {
      ...article,
      category: article.categories ? (Array.isArray(article.categories) ? article.categories[0] : article.categories) : null,
      categories: undefined // Remove the original categories property
    };

    res.json({ article: transformedArticle });
  } catch (error) {
    console.error("Route error:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET /v1/articles/:id - Get single article
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("articles")
      .select(`
        *,
        categories(name, slug),
        users(first_name, last_name, email)
      `)
      .eq("id", id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Article not found" });
    }

    // Increment view count
    await supabase.rpc("increment_view_count", { table_name: "articles", record_id: id });

    // Transform the data to match frontend expectations
    const transformedArticle = {
      ...data,
      category: data.categories ? (Array.isArray(data.categories) ? data.categories[0] : data.categories) : null,
      categories: undefined // Remove the original categories property
    };

    res.json(transformedArticle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /v1/articles - Create new article
router.post("/", async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      cover_image_url,
      category_id,
      author_id,
      status = "draft",
      tags,
      published_at,
    } = req.body;

    const { data, error } = await supabase
      .from("articles")
      .insert([
        {
          title,
          slug,
          excerpt,
          content,
          cover_image_url,
          category_id,
          author_id: author_id || null, // Make author_id optional
          status,
          tags,
          published_at: status === "published" ? published_at || new Date().toISOString() : null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /v1/articles/:id - Update article
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // If publishing and no published_at, set it
    if (updates.status === "published" && !updates.published_at) {
      updates.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("articles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /v1/articles/:id - Delete article
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("articles").delete().eq("id", id);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
