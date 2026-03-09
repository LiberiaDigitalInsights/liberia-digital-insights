import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";
import { sendEmail } from "@/lib/email";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// POST /api/v1/users/[id]/reset-password - Reset user password (Admin only)
async function postHandler(request, { params }) {
  try {
    const { id } = await params;

    // Fetch user details first
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("email, first_name")
      .eq("id", id)
      .single();

    if (fetchError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate temporary password
    const tempPassword = crypto.randomBytes(6).toString("hex");
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(tempPassword, saltRounds);

    // Update password
    const { error: updateError } = await supabase
      .from("users")
      .update({
        password_hash,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) throw updateError;

    // Send reset notification email
    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset - Liberia Digital Insights",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; border: 1px solid #eee; border-radius: 16px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #111827; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -1px; text-transform: uppercase; font-style: italic;">Liberia Digital <span style="color: #3b82f6;">Insights</span></h1>
            </div>
            
            <h2 style="color: #111827; font-size: 20px; font-weight: 800; text-align: center; margin-bottom: 24px;">Password Reset</h2>
            
            <p style="color: #4b5563; font-size: 14px; line-height: 1.5;">Hello ${user.first_name || "User"},</p>
            <p style="color: #4b5563; font-size: 14px; line-height: 1.5;">An administrator has reset your password for the Liberia Digital Insights platform. Use the temporary password below to log in.</p>
            
            <div style="background: #f9fafb; padding: 24px; border-radius: 12px; margin: 32px 0; text-align: center; border: 1px dashed #d1d5db;">
              <p style="margin: 0; font-size: 10px; font-weight: 800; text-transform: uppercase; color: #6b7280; letter-spacing: 1px;">Temporary Password</p>
              <p style="margin: 12px 0 0; font-size: 32px; font-weight: 900; letter-spacing: 4px; color: #111827;">${tempPassword}</p>
            </div>
            
            <div style="text-align: center; margin-top: 32px;">
              <p style="color: #4b5563; font-size: 13px; font-weight: 600;">Please log in and change your password immediately in your account settings.</p>
            </div>
            
            <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 40px 0;" />
            
            <p style="font-size: 11px; color: #9ca3af; text-align: center; margin: 0;">If you did not expect this change, please contact your administrator.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("[api/users/id/reset-password] Email failed:", emailError);
      // We don't throw here so the admin still gets the password in the UI as a backup
    }

    return NextResponse.json({
      success: true,
      tempPassword,
      message:
        "Password reset successfully. An email has been sent to the user.",
    });
  } catch (error) {
    console.error("[api/users/id/reset-password] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const POST = withAuth(postHandler, ["admin"]);
