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
    const { data: logEntry, error } = await supabase
      .from("audit_logs")
      .insert([
        {
          action,
          target_type: targetType,
          target_id: targetId,
          actor_id: actorId,
          metadata,
          ip_address: ipAddress,
          created_at: new Date().toISOString(),
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.error("[AuditLog] Error inserting log:", error);
      // We don't throw here to avoid breaking the main request if logging fails
    }

    // High-stakes actions trigger a real-time notification
    const notificationTriggers = [
      "DELETE_USER",
      "UPDATE_USER_ROLE",
      "DISABLE_USER",
      "UPDATE_SETTINGS",
    ];

    if (notificationTriggers.includes(action)) {
      const typeMap = {
        DELETE_USER: "USER",
        UPDATE_USER_ROLE: "SECURITY",
        DISABLE_USER: "SECURITY",
        UPDATE_SETTINGS: "SYSTEM",
      };

      const titleMap = {
        DELETE_USER: "User Account Deleted",
        UPDATE_USER_ROLE: "Permissions Modified",
        DISABLE_USER: "Account Deactivated",
        UPDATE_SETTINGS: "System Configuration Updated",
      };

      const { data: notification } = await supabase
        .from("notifications")
        .insert([
          {
            type: typeMap[action] || "SYSTEM",
            title: titleMap[action] || "System Update",
            message: `Administrative action ${action} was performed by an authorized user.`,
            user_id: null, // Broadcast to all admins
            metadata: { audit_id: logEntry?.id, ...metadata },
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      // Broadcast Web Push to all admins who have subscriptions
      if (notification) {
        try {
          // Fetch all subscriptions for admin users
          const { data: adminSubscriptions } = await supabase
            .from("push_subscriptions")
            .select("subscription, id")
            .not("user_id", "is", null);

          if (adminSubscriptions && adminSubscriptions.length > 0) {
            const pushPayload = {
              title: notification.title,
              message: notification.message,
              url: "/admin/activity",
            };

            const result = await broadcastPushNotification(
              adminSubscriptions.map((s) => s.subscription),
              pushPayload,
            );

            // Cleanup expired subscriptions
            if (result.expiredEndpoints.length > 0) {
              await supabase
                .from("push_subscriptions")
                .delete()
                .filter(
                  "subscription->>endpoint",
                  "in",
                  `(${result.expiredEndpoints.map((e) => `"${e}"`).join(",")})`,
                );
            }
          }
        } catch (pushErr) {
          console.error("[AuditLog] Push broadcast failed:", pushErr);
        }
      }
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
