import { supabase } from "./supabase";

/**
 * Logs an administrative action to the audit_logs table.
 *
 * @param {Object} params
 * @param {string} params.action - The action being performed (e.g., 'DELETE_USER')
 * @param {string} params.targetType - The type of resource being affected (e.g., 'user', 'setting')
 * @param {string} [params.targetId] - The ID of the affected resource
 * @param {string} [params.actorId] - The ID of the user performing the action
 * @param {Object} [params.metadata] - Additional context/data about the action
 * @param {string} [params.ipAddress] - The IP address of the request
 */
export async function logAudit({
  action,
  targetType,
  targetId = null,
  actorId = null,
  metadata = {},
  ipAddress = null,
}) {
  try {
    const { error } = await supabase.from("audit_logs").insert([
      {
        action,
        target_type: targetType,
        target_id: targetId,
        actor_id: actorId,
        metadata,
        ip_address: ipAddress,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("[AuditLog] Error inserting log:", error);
      // We don't throw here to avoid breaking the main request if logging fails
    }
  } catch (err) {
    console.error("[AuditLog] Unexpected error:", err);
  }
}

/**
 * Helper to extract IP from request headers if available
 */
export function getClientIp(request) {
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  return null;
}
