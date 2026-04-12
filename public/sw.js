/*
 * Service Worker for Web Push Notifications
 */

self.addEventListener("push", function (event) {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const options = {
      body:
        data.message ||
        data.body ||
        "New activity on Liberia Digital Insights.",
      icon: "/icons/notification-icon.png",
      badge: "/icons/badge-icon.png",
      data: {
        url: data.url || "/admin/activity",
      },
      actions: [
        {
          action: "view",
          title: "View Details",
        },
      ],
      vibrate: [100, 50, 100],
    };

    event.waitUntil(
      self.registration.showNotification(
        data.title || "LDI System Alert",
        options,
      ),
    );
  } catch (err) {
    console.error("Error receiving push notification:", err);
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/admin/activity";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.includes(urlToOpen) && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});
