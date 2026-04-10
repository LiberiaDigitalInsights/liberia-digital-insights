import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";
import { invitationSchema } from "@/lib/schemas/auth";
import { crypto } from "crypto";
import { sendEmail } from "@/lib/email";

// POST /api/v1/invitations - Create a new invitation (Admin only)
async function postHandler(request) {
  try {
    const body = await request.json();

    // 1. Validate input
    const validated = invitationSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validated.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { email, role } = validated.data;

    // 2. Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 400 },
      );
    }

    // 3. Check for existing pending invitation
    const { data: existingInvite } = await supabase
      .from("invitations")
      .select("id, expires_at")
      .eq("email", email)
      .single();

    if (existingInvite && new Date(existingInvite.expires_at) > new Date()) {
      return NextResponse.json(
        { error: "A pending invitation already exists for this email" },
        { status: 400 },
      );
    }

    // 4. Generate secure token
    const token = require("crypto").randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48); // 48 hours expiry

    // 5. Save invitation
    const { data: invite, error } = await supabase
      .from("invitations")
      .upsert({
        email,
        role,
        token,
        invited_by: request.user.id,
        expires_at: expiresAt.toISOString(),
        accepted_at: null,
      })
      .select()
      .single();

    if (error) throw error;

    // 6. Send Invitation Email
    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/invite/${token}`;

    try {
      await sendEmail({
        to: email,
        subject: "Invitation to join Liberia Digital Insights",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #0ea5e9; font-style: italic; font-weight: 900; text-transform: uppercase;">Liberia Digital <span style="color: #000;">Insights</span></h2>
            <p>Hello,</p>
            <p>You have been invited to join the <strong>Liberia Digital Insights</strong> team as an <strong>${role.toUpperCase()}</strong>.</p>
            <p>Please click the button below to set up your account and get started. This link will expire in 48 hours.</p>
            <div style="margin: 30px 0;">
              <a href="${inviteUrl}" style="background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 50px; font-weight: bold; text-transform: uppercase; font-size: 14px;">Complete Your Setup</a>
            </div>
            <p style="color: #666; font-size: 12px;">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="color: #666; font-size: 12px; word-break: break-all;">${inviteUrl}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 11px; color: #999;">This invitation was sent by the LDI Administration team.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("[api/invitations] Email delivery failed:", emailError);
      // We don't fail the whole request, but return a warning?
      // Actually, for invitations, email is critical.
      return NextResponse.json(
        {
          error:
            "Invitation created, but email delivery failed. Please check SMTP settings.",
        },
        { status: 201 },
      );
    }

    // 7. Log Audit
    const { logAudit, getClientIp } = await import("@/lib/audit");
    await logAudit({
      action: "INVITE_USER",
      targetType: "user",
      targetId: invite.id,
      actorId: request.user.id,
      ipAddress: getClientIp(request),
      metadata: { email, role },
    });

    return NextResponse.json({
      message: "Invitation sent successfully",
      invite,
    });
  } catch (error) {
    console.error("[api/invitations] POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET /api/v1/invitations - List invitations (Admin only)
async function getHandler(request) {
  try {
    const { data, error } = await supabase
      .from("invitations")
      .select(
        `
        *,
        invited_by_user:users!invited_by(first_name, last_name, email)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/invitations] GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/v1/invitations - Revoke an invitation (Admin only)
async function deleteHandler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing invitation ID" },
        { status: 400 },
      );
    }

    const { data: invite, error: fetchError } = await supabase
      .from("invitations")
      .select("email")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    const { error } = await supabase.from("invitations").delete().eq("id", id);
    if (error) throw error;

    // Log Audit
    const { logAudit, getClientIp } = await import("@/lib/audit");
    await logAudit({
      action: "REVOKE_INVITE",
      targetType: "user",
      targetId: id,
      actorId: request.user.id,
      ipAddress: getClientIp(request),
      metadata: { email: invite.email },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[api/invitations] DELETE error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const POST = withAuth(postHandler, ["admin"]);
export const GET = withAuth(getHandler, ["admin"]);
export const DELETE = withAuth(deleteHandler, ["admin"]);
