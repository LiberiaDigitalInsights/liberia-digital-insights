import { Router } from "express";
import { supabase } from "../supabaseClient.js";
import emailService from "../services/emailService.js";

const router = Router();

// GET /v1/talents - Get all talents
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("talents")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (category && category !== "All") {
      query = query.eq("category", category);
    }

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error, count } = await query;

    if (error) {
      // If table doesn't exist, return empty results
      if (
        error.message?.includes("schema cache") ||
        error.code === "PGRST116"
      ) {
        return res.json({
          talents: [],
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: 0,
            pages: 0,
          },
        });
      }
      throw error;
    }

    res.json({
      talents: data || [],
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

// GET /v1/talents/slug/:slug - Get single talent by slug
router.get("/slug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const { data, error } = await supabase
      .from("talents")
      .select("*")
      .eq("slug", slug)
      .limit(1);

    if (error) {
      // If table doesn't exist, return 404
      if (
        error.message?.includes("schema cache") ||
        error.code === "PGRST116"
      ) {
        return res.status(404).json({ error: "Talent not found" });
      }
      throw error;
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Talent not found" });
    }

    res.json({ talent: data[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /v1/talents/:id - Get single talent
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("talents")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Talent not found" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /v1/talents - Create new talent
router.post("/", async (req, res) => {
  try {
    const {
      name,
      slug,
      role,
      bio,
      category,
      links,
      avatar_url,
      status = "published",
      skills,
      experience,
      location,
      availability,
    } = req.body;

    const { data, error } = await supabase
      .from("talents")
      .insert([
        {
          name,
          slug,
          role,
          bio,
          category,
          links,
          avatar_url,
          status,
          skills,
          experience,
          location,
          availability,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Send admin notification
    try {
      await emailService.sendTalentSubmissionNotification(data);
    } catch (emailError) {
      console.error("Failed to send admin notification:", emailError);
      // Don't block response
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /v1/talents/:id - Update talent
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("talents")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Talent not found" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /v1/talents/:id - Delete talent
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("talents").delete().eq("id", id);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /v1/talents/seed - Seed talents table
router.post("/seed", async (req, res) => {
  try {
    console.log("🌱 Seeding talents...");

    const { data, error } = await supabase
      .from("talents")
      .upsert([
        {
          name: "Sarah Johnson",
          slug: "sarah-johnson",
          role: "Product Designer",
          bio: "Product designer focused on accessible, inclusive UX with 5+ years of experience in fintech and healthcare applications.",
          category: "Design",
          links: {
            website: "https://sarahdesigns.example.com",
            twitter: "https://twitter.com/sarahjohnson",
            linkedin: "https://linkedin.com/in/sarahjohnson",
          },
          avatar_url:
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
          status: "published",
          skills: [
            "UI/UX Design",
            "Figma",
            "Accessibility",
            "User Research",
            "Prototyping",
          ],
          experience: "5+ years",
          location: "Monrovia, Liberia",
          availability: "Available for freelance",
        },
        {
          name: "James Doe",
          slug: "james-doe",
          role: "Fullstack Engineer",
          bio: "Fullstack engineer building performant web applications with expertise in React, Node.js, and cloud architecture.",
          category: "Engineering",
          links: {
            github: "https://github.com/jamesdoe",
            linkedin: "https://linkedin.com/in/jamesdoe",
            website: "https://jamesdoe.dev",
          },
          avatar_url:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          status: "published",
          skills: [
            "React",
            "Node.js",
            "TypeScript",
            "AWS",
            "PostgreSQL",
            "Docker",
          ],
          experience: "7+ years",
          location: "Accra, Ghana",
          availability: "Open to opportunities",
        },
        {
          name: "Amina Mensah",
          slug: "amina-mensah",
          role: "Product Manager",
          bio: "Product manager specializing in digital transformation and agile methodologies. Passionate about building products that solve real problems.",
          category: "Product",
          links: {
            linkedin: "https://linkedin.com/in/aminamensah",
            twitter: "https://twitter.com/aminamensah",
          },
          avatar_url:
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
          status: "published",
          skills: [
            "Product Strategy",
            "Agile",
            "Data Analysis",
            "User Stories",
            "Roadmapping",
          ],
          experience: "6+ years",
          location: "Lagos, Nigeria",
          availability: "Not available",
        },
        {
          name: "Kofi Annan",
          slug: "kofi-annan",
          role: "Mobile Developer",
          bio: "Mobile developer specializing in React Native and Flutter applications. Experienced in building scalable mobile solutions for startups.",
          category: "Engineering",
          links: {
            github: "https://github.com/kofiannan",
            portfolio: "https://kofiannan.mobile.dev",
          },
          avatar_url:
            "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
          status: "published",
          skills: [
            "React Native",
            "Flutter",
            "iOS",
            "Android",
            "Firebase",
            "Redux",
          ],
          experience: "4+ years",
          location: "Kumasi, Ghana",
          availability: "Available for contract",
        },
        {
          name: "Fatou Bah",
          slug: "fatou-bah",
          role: "UX Researcher",
          bio: "UX researcher focused on user-centered design for emerging markets. Expertise in qualitative research and usability testing.",
          category: "Design",
          links: {
            linkedin: "https://linkedin.com/in/fatoubah",
            website: "https://fatoubah.research.example.com",
          },
          avatar_url:
            "https://images.unsplash.com/photo-1580489940961-15a19d654956?w=150&h=150&fit=crop&crop=face",
          status: "published",
          skills: [
            "User Research",
            "Usability Testing",
            "Qualitative Analysis",
            "Survey Design",
            "Interviews",
          ],
          experience: "3+ years",
          location: "Banjul, Gambia",
          availability: "Available for freelance",
        },
      ])
      .select();

    if (error) {
      console.error("❌ Talents seeding error:", error);
      return res
        .status(500)
        .json({ error: "Failed to seed talents", details: error });
    }

    console.log(`✅ Inserted ${data.length} talents`);

    res.json({
      message: "Talents seeded successfully!",
      count: data.length,
      talents: data,
    });
  } catch (error) {
    console.error("❌ Seeding error:", error);
    res.status(500).json({ error: "Seeding failed", details: error.message });
  }
});

export default router;
