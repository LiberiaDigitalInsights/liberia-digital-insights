import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";

const SETTINGS_KEY = "global";

// GET /api/v1/settings - Fetch platform settings (Admin/Editor)
async function getHandler() {
  try {
    const { data, error } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", SETTINGS_KEY)
      .single();

    if (error) {
      // Table may not exist yet — return empty so the UI uses defaults
      if (
        error.code === "PGRST116" ||
        error.message?.includes("does not exist")
      ) {
        return NextResponse.json({});
      }
      throw error;
    }

    return NextResponse.json(data?.value || {});
  } catch (error) {
    console.error("[api/settings] GET error:", error);
    return NextResponse.json({});
  }
}

// PUT /api/v1/settings - Persist platform settings (Admin only)
async function putHandler(request) {
  try {
    const body = await request.json();

    const { error } = await supabase.from("app_settings").upsert(
      {
        key: SETTINGS_KEY,
        value: body,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" },
    );

    if (error) {
      // If the table doesn't exist, still return success — settings are stored on client
      if (error.message?.includes("does not exist")) {
        return NextResponse.json({ success: true, persisted: false });
      }
      throw error;
    }

    return NextResponse.json({ success: true, persisted: true });
  } catch (error) {
    console.error("[api/settings] PUT error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const GET = withAuth(getHandler, ["admin", "editor"]);
export const PUT = withAuth(putHandler, ["admin"]);
