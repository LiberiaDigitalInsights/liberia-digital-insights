import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";

// GET /api/v1/newsletters/templates - List newsletter templates (Admin/Editor)
async function getHandler() {
  try {
    const { data: templates, error } = await supabase
      .from("newsletter_templates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      if (error.code === "42P01") {
        // Table does not exist
        return NextResponse.json({ templates: [] });
      }
      throw error;
    }
    return NextResponse.json({ templates });
  } catch (error) {
    console.error("[api/newsletters/templates] GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/v1/newsletters/templates - Create custom template (Admin/Editor)
async function postHandler(request) {
  try {
    const { name, subject, preview, content, category } = await request.json();
    if (!name || !subject || !content) {
      return NextResponse.json(
        { error: "Name, subject, and content are required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("newsletter_templates")
      .insert([{ name, subject, content, category: category || "custom" }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("[api/newsletters/templates] POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const GET = withAuth(getHandler, ["admin", "editor"]);
export const POST = withAuth(postHandler, ["admin", "editor"]);
