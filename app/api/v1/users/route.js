import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { userQuerySchema, userSubmissionSchema } from "@/lib/schemas/content";

// GET /api/v1/users - List all users (Admin only)
async function getHandler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const result = userQuerySchema.safeParse(queryParams);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: result.error.format() },
        { status: 400 },
      );
    }

    const { page, limit, search, role } = result.data;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("users")
      .select(
        "id, email, first_name, last_name, role, is_active, created_at, last_login",
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (role) {
      query = query.eq("role", role);
    }

    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`,
      );
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      users: data || [],
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("[api/users] GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/v1/users - Create new user and send invitation (Admin only)
async function postHandler(request) {
  try {
    const body = await request.json();

    const result = userSubmissionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 },
      );
    }

    const { email, first_name, last_name, role, is_active } = result.data;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
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
          is_active,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Send invitation email
    try {
      const { sendEmail } = await import("@/lib/email");
      await sendEmail({
        to: user.email,
        subject: "You've been invited to Liberia Digital Insights",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; border: 1px solid #eee; border-radius: 16px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #111827; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -1px; text-transform: uppercase; font-style: italic;">Liberia Digital <span style="color: #3b82f6;">Insights</span></h1>
            </div>
            
            <h2 style="color: #111827; font-size: 20px; font-weight: 800; text-align: center; margin-bottom: 24px;">Welcome Aboard!</h2>
            
            <p style="color: #4b5563; font-size: 14px; line-height: 1.5;">Hello ${user.first_name || "there"},</p>
            <p style="color: #4b5563; font-size: 14px; line-height: 1.5;">You have been invited to join the Liberia Digital Insights team as a <strong>${user.role}</strong>. Use the temporary password below to log in for the first time.</p>
            
            <div style="background: #f9fafb; padding: 24px; border-radius: 12px; margin: 32px 0; text-align: center; border: 1px dashed #d1d5db;">
              <p style="margin: 0; font-size: 10px; font-weight: 800; text-transform: uppercase; color: #6b7280; letter-spacing: 1px;">Temporary Password</p>
              <p style="margin: 12px 0 0; font-size: 32px; font-weight: 900; letter-spacing: 4px; color: #111827;">${tempPassword}</p>
            </div>
            
            <div style="text-align: center; margin-top: 32px;">
              <p style="color: #4b5563; font-size: 13px; font-weight: 600;">Please log in and change your password immediately in your account settings.</p>
            </div>
            
            <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 40px 0;" />
            
            <p style="font-size: 11px; color: #9ca3af; text-align: center; margin: 0;">This is an automated message. Please do not reply.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("[api/users] Invitation email failed:", emailError);
    }

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("[api/users] POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const GET = withAuth(getHandler, ["admin"]);
export const POST = withAuth(postHandler, ["admin"]);
