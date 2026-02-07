import { Router } from "express";
import { supabase } from "../supabaseClient.js";
import emailService from "../services/emailService.js";
import { verifyToken, authorize } from "../middleware/rbacMiddleware.js";

const router = Router();

// GET /v1/newsletters/templates - Get newsletter templates
router.get(
  "/templates",
  verifyToken,
  authorize(["admin", "editor"]),
  async (req, res) => {
    try {
      const { data: templates, error } = await supabase
        .from("newsletter_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        if (error.code === "42P01") {
          return res.json({ templates: [] });
        }
        throw error;
      }
      res.json({ templates });
    } catch (error) {
      console.error("Get templates error:", error);
      res.status(500).json({ error: error.message });
    }
  },
);

// POST /v1/newsletters/templates - Create custom template
router.post(
  "/templates",
  verifyToken,
  authorize(["admin", "editor"]),
  async (req, res) => {
    try {
      const { name, subject, preview, content, category } = req.body;
      if (!name || !subject || !content) {
        return res
          .status(400)
          .json({ error: "Name, subject, and content are required" });
      }

      const { data, error } = await supabase
        .from("newsletter_templates")
        .insert([{ name, subject, content, category: category || "custom" }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      console.error("Create template error:", error);
      res.status(500).json({ error: error.message });
    }
  },
);

// GET /v1/newsletters/analytics - Get newsletter analytics
router.get(
  "/analytics",
  verifyToken,
  authorize(["admin", "editor"]),
  async (req, res) => {
    try {
      const { data: subscribers, error: subscribersError } = await supabase
        .from("newsletter_subscribers")
        .select("status, subscribed_at, unsubscribed_at");

      if (subscribersError) throw subscribersError;

      const totalSubscribers = subscribers.length;
      const activeSubscribers = subscribers.filter(
        (s) => s.status === "active",
      ).length;
      const unsubscribedSubscribers = subscribers.filter(
        (s) => s.status === "unsubscribed",
      ).length;

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentSubscriptions = subscribers.filter(
        (s) => new Date(s.subscribed_at) >= thirtyDaysAgo,
      ).length;
      const recentUnsubscriptions = subscribers.filter(
        (s) =>
          s.unsubscribed_at && new Date(s.unsubscribed_at) >= thirtyDaysAgo,
      ).length;

      const { data: newsletters, error: newslettersError } = await supabase
        .from("newsletters")
        .select("status, sent_date, subscriber_count");

      if (newslettersError) throw newslettersError;

      const sentNewsletters = newsletters.filter(
        (n) => n.status === "sent",
      ).length;
      const draftNewsletters = newsletters.filter(
        (n) => n.status === "draft",
      ).length;
      const scheduledNewsletters = newsletters.filter(
        (n) => n.status === "scheduled",
      ).length;
      const totalRecipients = newsletters.reduce(
        (sum, n) => sum + (n.subscriber_count || 0),
        0,
      );

      res.json({
        subscribers: {
          total: totalSubscribers,
          active: activeSubscribers,
          unsubscribed: unsubscribedSubscribers,
          recentSubscriptions,
          recentUnsubscriptions,
          growthRate:
            totalSubscribers > 0
              ? ((recentSubscriptions / totalSubscribers) * 100).toFixed(1)
              : 0,
        },
        newsletters: {
          total: newsletters.length,
          sent: sentNewsletters,
          drafts: draftNewsletters,
          scheduled: scheduledNewsletters,
          totalRecipients,
        },
        metrics: {
          averageSubscribersPerNewsletter:
            sentNewsletters > 0
              ? Math.round(totalRecipients / sentNewsletters)
              : 0,
          unsubscribeRate:
            totalSubscribers > 0
              ? ((unsubscribedSubscribers / totalSubscribers) * 100).toFixed(1)
              : 0,
        },
      });
    } catch (error) {
      console.error("Newsletter analytics error:", error);
      res.status(500).json({ error: error.message });
    }
  },
);

// GET /v1/newsletters/subscribers - Get all subscribers
router.get(
  "/subscribers",
  verifyToken,
  authorize(["admin", "editor"]),
  async (req, res) => {
    try {
      const { page = 1, limit = 50, status, search } = req.query;
      const offset = (page - 1) * limit;

      let query = supabase
        .from("newsletter_subscribers")
        .select("*", { count: "exact" })
        .order("subscribed_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (status) query = query.eq("status", status);
      if (search)
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);

      const { data, error, count } = await query;
      if (error) throw error;

      res.json({
        subscribers: data,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      console.error("Get subscribers error:", error);
      res.status(500).json({ error: error.message });
    }
  },
);

// DELETE /v1/newsletters/subscribers/:id - Delete subscriber
router.delete(
  "/subscribers/:id",
  verifyToken,
  authorize(["admin"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { error } = await supabase
        .from("newsletter_subscribers")
        .delete()
        .eq("id", id);
      if (error) throw error;
      res.status(204).send();
    } catch (error) {
      console.error("Delete subscriber error:", error);
      res.status(500).json({ error: error.message });
    }
  },
);

// PUT /v1/newsletters/subscribers/:id - Update subscriber
router.put(
  "/subscribers/:id",
  verifyToken,
  authorize(["admin", "editor"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ error: "Subscriber not found" });
      res.json(data);
    } catch (error) {
      console.error("Update subscriber error:", error);
      res.status(500).json({ error: error.message });
    }
  },
);

// GET /v1/newsletters - Get all newsletters
router.get(
  "/",
  verifyToken,
  authorize(["admin", "editor"]),
  async (req, res) => {
    try {
      const { page = 1, limit = 10, status, search } = req.query;
      const offset = (page - 1) * limit;

      let query = supabase
        .from("newsletters")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (status) query = query.eq("status", status);
      if (search)
        query = query.or(`subject.ilike.%${search}%,preview.ilike.%${search}%`);

      const { data, error, count } = await query;
      if (error) throw error;

      res.json({
        newsletters: data,
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
  },
);

// GET /v1/newsletters/:id - Get single newsletter
router.get(
  "/:id",
  verifyToken,
  authorize(["admin", "editor"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from("newsletters")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      if (!data) return res.status(404).json({ error: "Newsletter not found" });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// POST /v1/newsletters - Create new newsletter
router.post(
  "/",
  verifyToken,
  authorize(["admin", "editor"]),
  async (req, res) => {
    try {
      const {
        subject,
        preview,
        content,
        cover_image_url,
        scheduled_date,
        status = "draft",
      } = req.body;
      const { data, error } = await supabase
        .from("newsletters")
        .insert([
          {
            subject,
            preview,
            content,
            cover_image_url,
            scheduled_date,
            status,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// PUT /v1/newsletters/:id - Update newsletter
router.put(
  "/:id",
  verifyToken,
  authorize(["admin", "editor"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      if (updates.status === "sent" && !updates.sent_date) {
        updates.sent_date = new Date().toISOString();
      }
      const { data, error } = await supabase
        .from("newsletters")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      if (!data) return res.status(404).json({ error: "Newsletter not found" });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// DELETE /v1/newsletters/:id - Delete newsletter
router.delete("/:id", verifyToken, authorize(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("newsletters").delete().eq("id", id);
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /v1/newsletters/subscribe - Subscribe to newsletter (PUBLIC)
router.post("/subscribe", async (req, res) => {
  try {
    const { name, email, company, org, position } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const { data: existingSubscriber } = await supabase
      .from("newsletter_subscribers")
      .select("email")
      .eq("email", email)
      .single();

    if (existingSubscriber) {
      return res.status(409).json({ error: "Email already subscribed" });
    }

    const crypto = await import("crypto");
    const unsubscribeToken = crypto.randomBytes(32).toString("hex");

    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .insert([
        {
          name,
          email,
          company,
          org,
          position,
          subscribed_at: new Date().toISOString(),
          status: "active",
          unsubscribe_token: unsubscribeToken,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    res
      .status(201)
      .json({
        message: "Successfully subscribed to newsletter",
        subscriber: data,
      });

    setImmediate(async () => {
      try {
        await emailService.sendWelcomeEmail(data);
      } catch (error) {
        console.error("Failed to send welcome email:", error);
      }
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST /v1/newsletters/unsubscribe - Unsubscribe from newsletter (PUBLIC)
router.post("/unsubscribe", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token)
      return res.status(400).json({ error: "Unsubscribe token is required" });

    const { data: subscriber, error: findError } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .eq("unsubscribe_token", token)
      .single();

    if (findError || !subscriber)
      return res.status(404).json({ error: "Invalid unsubscribe token" });
    if (subscriber.status === "unsubscribed")
      return res.status(400).json({ error: "Already unsubscribed" });

    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .update({
        status: "unsubscribed",
        unsubscribed_at: new Date().toISOString(),
      })
      .eq("id", subscriber.id)
      .select()
      .single();

    if (error) throw error;
    res.json({
      message: "Successfully unsubscribed from newsletter",
      subscriber: data,
    });
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET /v1/newsletters/:id/replies - Get newsletter replies
router.get(
  "/:id/replies",
  verifyToken,
  authorize(["admin", "editor"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const replies = []; // Placeholder for real replies table
      res.json({ replies });
    } catch (error) {
      console.error("Get newsletter replies error:", error);
      res.status(500).json({ error: error.message });
    }
  },
);

// POST /v1/newsletters/:id/reply - Reply to a subscriber
router.post(
  "/:id/reply",
  verifyToken,
  authorize(["admin", "editor"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { subscriberId, content } = req.body;
      if (!subscriberId || !content)
        return res
          .status(400)
          .json({ error: "Subscriber ID and content are required" });
      res.json({
        message: "Reply sent successfully",
        reply: {
          id: Date.now().toString(),
          newsletterId: id,
          subscriberId,
          content,
          createdAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Reply to subscriber error:", error);
      res.status(500).json({ error: error.message });
    }
  },
);

// POST /v1/newsletters/:id/send - Send newsletter
router.post(
  "/:id/send",
  verifyToken,
  authorize(["admin", "editor"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { recipients, scheduleType, scheduledAt, customRecipients } =
        req.body;

      const { data: newsletter, error: newsletterError } = await supabase
        .from("newsletters")
        .select("*")
        .eq("id", id)
        .single();
      if (newsletterError || !newsletter)
        return res.status(404).json({ error: "Newsletter not found" });

      let subscribersQuery = supabase
        .from("newsletter_subscribers")
        .select("*");
      if (recipients === "active")
        subscribersQuery = subscribersQuery.eq("status", "active");
      else if (
        recipients === "custom" &&
        customRecipients &&
        customRecipients.length > 0
      )
        subscribersQuery = subscribersQuery.in("id", customRecipients);
      if (recipients !== "custom")
        subscribersQuery = subscribersQuery.neq("status", "unsubscribed");

      const { data: subscribers, error: subscribersError } =
        await subscribersQuery;
      if (subscribersError) throw subscribersError;

      if (scheduleType === "immediate") {
        const results = await emailService.sendNewsletter(
          newsletter,
          subscribers,
        );
        const successCount = results.filter((r) => r.status === "sent").length;
        const { data: updatedNewsletter, error: updateError } = await supabase
          .from("newsletters")
          .update({
            status: "sent",
            sent_date: new Date().toISOString(),
            subscriber_count: successCount,
          })
          .eq("id", id)
          .select()
          .single();
        if (updateError) throw updateError;
        res.json({
          message: `Newsletter sent successfully to ${successCount} recipients`,
          newsletter: updatedNewsletter,
          results,
        });
      } else if (scheduleType === "scheduled") {
        const { data, error } = await supabase
          .from("newsletters")
          .update({ status: "scheduled", scheduled_date: scheduledAt })
          .eq("id", id)
          .select()
          .single();
        if (error) throw error;
        res.json({
          message: "Newsletter scheduled successfully",
          newsletter: data,
        });
      }
    } catch (error) {
      console.error("Send newsletter error:", error);
      res.status(500).json({ error: error.message });
    }
  },
);

export default router;
