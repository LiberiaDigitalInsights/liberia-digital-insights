import { NextResponse } from "next/server";
import { withAuth } from "@/lib/apiAuth";
import { verifySmtp } from "@/lib/email";

// POST /api/v1/settings/test-smtp - Test SMTP connection (Admin only)
async function postHandler(request) {
  try {
    const settings = await request.json();

    // Prepare settings with fallbacks to environment variables
    const finalSettings = {
      smtpHost: settings.smtpHost || process.env.SMTP_HOST,
      smtpPort: settings.smtpPort || process.env.SMTP_PORT || "587",
      smtpUser: settings.smtpUser || process.env.SMTP_USER,
      smtpPassword: settings.smtpPassword || process.env.SMTP_PASS,
      smtpSecure: settings.smtpSecure ?? process.env.SMTP_SECURE === "false",
    };

    if (
      !finalSettings.smtpHost ||
      !finalSettings.smtpUser ||
      !finalSettings.smtpPassword
    ) {
      return NextResponse.json(
        {
          error:
            "SMTP host, user, and password are required (either in settings or environment)",
        },
        { status: 400 },
      );
    }

    await verifySmtp(finalSettings);

    return NextResponse.json({
      success: true,
      message: "SMTP connection verified successfully!",
    });
  } catch (error) {
    console.error("[api/settings/test-smtp] error:", error);
    return NextResponse.json(
      { error: "SMTP Verification Failed: " + error.message },
      { status: 500 },
    );
  }
}

export const POST = withAuth(postHandler, ["admin"]);
