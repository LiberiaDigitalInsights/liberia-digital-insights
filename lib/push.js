import webPush from "web-push";

const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;

if (publicKey && privateKey) {
  webPush.setVapidDetails(
    "mailto:liberiadigitalinsights@gmail.com",
    publicKey,
    privateKey,
  );
}

/**
 * Sends a push notification to a single subscription.
 * @param {Object} subscription - Browser push subscription object
 * @param {Object} payload - Notification data (title, body, etc.)
 */
export async function sendPushNotification(subscription, payload) {
  try {
    const response = await webPush.sendNotification(
      subscription,
      JSON.stringify(payload),
    );
    return response;
  } catch (error) {
    if (error.statusCode === 410 || error.statusCode === 404) {
      // Subscription has expired or is no longer valid
      console.warn(
        "[Push] Subscription expired or not found:",
        subscription.endpoint,
      );
      return { expired: true };
    }
    console.error("[Push] Error sending notification:", error);
    throw error;
  }
}

/**
 * Broadcasts a push notification to multiple subscriptions.
 * @param {Array} subscriptions - Array of subscription objects
 * @param {Object} payload - Notification data
 */
export async function broadcastPushNotification(subscriptions, payload) {
  const results = await Promise.allSettled(
    subscriptions.map((sub) => sendPushNotification(sub, payload)),
  );

  const expiredEndpoints = [];
  results.forEach((result, index) => {
    if (result.status === "fulfilled" && result.value?.expired) {
      expiredEndpoints.push(subscriptions[index].endpoint);
    }
  });

  return {
    successCount: results.filter(
      (r) => r.status === "fulfilled" && !r.value?.expired,
    ).length,
    failureCount: results.filter((r) => r.status === "rejected").length,
    expiredEndpoints,
  };
}
