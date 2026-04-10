import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";
import { bulkOperationSchema } from "@/lib/schemas/content";

/**
 * POST /api/v1/articles/bulk
 * Performs a batch operation on a set of article IDs.
 * Actions: delete, publish, unpublish, archive
 */
async function bulkHandler(request) {
  try {
    const body = await request.json();
    const result = bulkOperationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 },
      );
    }

    const { ids, action } = result.data;

    let dbError;
    if (action === "delete") {
      const { error } = await supabase.from("articles").delete().in("id", ids);
      dbError = error;
    } else {
      const statusMap = {
        publish: "published",
        unpublish: "draft",
        archive: "archived",
      };

      const payload = {
        status: statusMap[action],
        updated_at: new Date().toISOString(),
      };

      if (action === "publish") {
        payload.published_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("articles")
        .update(payload)
        .in("id", ids);

      dbError = error;
    }

    if (dbError) throw dbError;

    // Log the batch audit event
    try {
      const { logAudit, getClientIp } = await import("@/lib/audit");
      await logAudit({
        action: `BATCH_${action.toUpperCase()}_ARTICLES`,
        targetType: "article",
        targetId:
          ids.join(",").substring(0, 100) + (ids.length > 3 ? "..." : ""),
        actorId: request.user.id,
        ipAddress: getClientIp(request),
        metadata: {
          item_count: ids.length,
          item_ids: ids,
          action_type: action,
        },
      });
    } catch (auditErr) {
      console.error("[BulkArticles] Audit logging failed:", auditErr);
    }

    return NextResponse.json({
      message: `Successfully performed ${action} on ${ids.length} articles`,
      item_count: ids.length,
    });
  } catch (error) {
    console.error("[BulkArticles] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const POST = withAuth(bulkHandler, ["admin", "editor"]);
