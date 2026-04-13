import { supabase } from "@/lib/supabase";
import { verifyAuth } from "@/lib/apiAuth";
import { logAudit } from "@/lib/audit";

/**
 * GET /api/v1/admin/export/[resource]
 * Export various administrative resources to CSV.
 */
export async function GET(req, { params }) {
  try {
    const auth = await verifyAuth(req);
    if (!auth || auth.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resource } = await params;
    const { searchParams } = new URL(req.url);

    let query;
    let filename = `ldi-${resource}-${new Date().toISOString().split("T")[0]}.csv`;
    let csvHeaders = "";
    let mapper = (row) => "";

    switch (resource) {
      case "subscribers":
        query = supabase
          .from("newsletter_subscribers")
          .select("*")
          .order("subscribed_at", { ascending: false });
        csvHeaders = "Email,Name,Status,Subscribed At\n";
        mapper = (r) =>
          `"${r.email}","${r.name || ""}","${r.status}","${r.subscribed_at}"\n`;
        break;

      case "audit-logs":
        const start = searchParams.get("start");
        const end = searchParams.get("end");
        query = supabase
          .from("audit_logs")
          .select("*")
          .order("created_at", { ascending: false });
        if (start) query = query.gte("created_at", start);
        if (end) query = query.lte("created_at", end);
        csvHeaders = "Timestamp,Action,Entity,Entity ID,User ID,Details\n";
        mapper = (r) =>
          `"${r.created_at}","${r.action}","${r.entity}","${r.entity_id}","${r.user_id}","${JSON.stringify(r.metadata).replace(/"/g, '""')}"\n`;
        break;

      case "users":
        query = supabase
          .from("users")
          .select("*")
          .order("created_at", { ascending: false });
        csvHeaders = "ID,Email,First Name,Last Name,Role,Status,Created At\n";
        mapper = (r) =>
          `"${r.id}","${r.email}","${r.first_name || ""}","${r.last_name || ""}","${r.role}","${r.is_active ? "Active" : "Inactive"}","${r.created_at}"\n`;
        break;

      case "content":
        // This is a more complex one, let's just do articles for now or a meta-export
        query = supabase
          .from("articles")
          .select("title, slug, status, category, published_at")
          .order("created_at", { ascending: false });
        csvHeaders = "Title,Slug,Status,Category,Published At\n";
        mapper = (r) =>
          `"${r.title.replace(/"/g, '""')}","${r.slug}","${r.status}","${r.category}","${r.published_at || ""}"\n`;
        break;

      default:
        return NextResponse.json(
          { error: "Invalid resource" },
          { status: 400 },
        );
    }

    const { data, error } = await query;
    if (error) throw error;

    // Log the export action for compliance
    await logAudit({
      action: "DATA_EXPORT",
      entity: "system",
      entity_id: resource,
      user_id: auth.user.id,
      metadata: {
        resource,
        rowCount: data?.length || 0,
        filters: Object.fromEntries(searchParams),
        ip: req.headers.get("x-forwarded-for") || "unknown",
      },
    });

    const csvBody = (data || []).map(mapper).join("");
    const csvContent = csvHeaders + csvBody;

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error(`[AdminExport] Error exporting ${params.resource}:`, err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
