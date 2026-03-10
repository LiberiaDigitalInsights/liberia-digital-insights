import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, subject, category, message } = body;

    if (!name || !email || !subject || !category || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Send email to admin
    await sendEmail({
      to: "info@liberiadigitalinsights.com", // Admin email
      subject: `New Contact Inquiry: ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #f87171; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0;">New Inquiry Received</h1>
          </div>
          <div style="padding: 30px;">
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Category:</strong> ${category}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
            This email was sent from the contact form on Liberia Digital Insights.
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("[api/contact] POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
