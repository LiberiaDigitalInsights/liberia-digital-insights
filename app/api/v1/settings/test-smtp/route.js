import { NextResponse } from "next/server";
import { withAuth } from "@/lib/apiAuth";
import { verifySmtp } from "@/lib/email";

// POST /api/v1/settings/test-smtp - Test SMTP connection (Admin only)
async function postHandler(request) {
  try {
    const settings = await request.json();

    if (!settings.smtpHost || !settings.smtpUser || !settings.smtpPassword) {
      return NextResponse.json(
        { error: "SMTP host, user, and password are required for testing" },
        { status: 400 },
      );
    }

    await verifySmtp(settings);

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
