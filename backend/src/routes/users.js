import { Router } from "express";
import { supabase } from "../supabaseClient.js";
import { verifyToken, authorize } from "../middleware/rbacMiddleware.js";
import bcrypt from "bcryptjs";
import emailService from "../services/emailService.js";
import crypto from "crypto";

const router = Router();

// POST /v1/users - Create new user and send invitation (Admin only)
router.post("/", verifyToken, authorize("admin"), async (req, res) => {
  try {
    const { email, first_name, last_name, role = "editor" } = req.body;

    if (!email || !first_name || !last_name) {
      return res
        .status(400)
        .json({ error: "Email, first name, and last name are required" });
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Generate temporary password
    const tempPassword = crypto.randomBytes(6).toString("hex");
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(tempPassword, saltRounds);

    // Create user
    const { data: user, error } = await supabase
      .from("users")
      .insert([
        {
          email,
          password_hash,
          first_name,
          last_name,
          role,
          is_active: true,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Send invitation email (asynchronously)
    setImmediate(async () => {
      try {
        await emailService.sendInvitationEmail(user, tempPassword);
      } catch (err) {
        console.error("Failed to send invitation email:", err);
      }
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /v1/users - List all users (Admin only)
router.get("/", verifyToken, authorize("admin"), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select(
        "id, email, first_name, last_name, role, is_active, created_at, last_login",
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /v1/users/:id - Get specific user (Admin only)
router.get("/:id", verifyToken, authorize("admin"), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select(
        "id, email, first_name, last_name, role, is_active, created_at, last_login",
      )
      .eq("id", req.params.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "User not found" });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /v1/users/:id/role - Update user role (Admin only)
router.put("/:id/role", verifyToken, authorize("admin"), async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ["admin", "editor", "moderator", "viewer", "user"];

    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role provided" });
    }

    // Prevent changing the last admin's role if needed, but for now simple update
    const { data, error } = await supabase
      .from("users")
      .update({ role, updated_at: new Date().toISOString() })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /v1/users/:id/status - Enable/Disable user (Admin only)
router.patch(
  "/:id/status",
  verifyToken,
  authorize("admin"),
  async (req, res) => {
    try {
      const { is_active } = req.body;

      if (typeof is_active !== "boolean") {
        return res.status(400).json({ error: "is_active must be a boolean" });
      }

      const { data, error } = await supabase
        .from("users")
        .update({ is_active, updated_at: new Date().toISOString() })
        .eq("id", req.params.id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// PUT /v1/users/change-password - Change own password
router.put("/change-password", verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id || req.user.userId; // Handle both for safety during transition

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Current and new passwords are required" });
    }

    // Get current user and password hash
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("password_hash")
      .eq("id", userId)
      .single();

    if (fetchError || !user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect current password" });
    }

    // Hash new password
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    const { error: updateError } = await supabase
      .from("users")
      .update({
        password_hash: newPasswordHash,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) throw updateError;

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /v1/users/:id - Delete user (Admin only)
router.delete("/:id", verifyToken, authorize("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent self-deletion
    if (id === req.user.id) {
      return res
        .status(400)
        .json({ error: "You cannot delete your own account" });
    }

    // Step 1: Nullify author_id in dependent tables to avoid foreign key violations
    // We do this for articles and insights (podcasts needs author_id column first)
    const tablesToNullify = ["articles", "insights"];

    for (const table of tablesToNullify) {
      const { error: nullifyError } = await supabase
        .from(table)
        .update({ author_id: null })
        .eq("author_id", id);

      if (nullifyError) {
        console.error(`Error nullifying author_id in ${table}:`, nullifyError);
        // We continue even if one fails, though it might cause the final delete to fail
      }
    }

    // Step 2: Delete the user
    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
