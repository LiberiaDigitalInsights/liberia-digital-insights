import { useState, useEffect, useCallback } from "react";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export function usePushNotifications() {
  const [subscription, setSubscription] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [loading, setLoading] = useState(true);
  const [permission, setPermission] = useState("default");

  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const getSubscription = useCallback(async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setIsSupported(false);
      setLoading(false);
      return;
    }

    setIsSupported(true);
    setPermission(Notification.permission);

    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
    } catch (err) {
      console.error("Error getting subscription:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => getSubscription())
        .catch((err) => console.error("SW registration failed:", err));
    }
  }, [getSubscription]);

  const subscribe = async () => {
    if (!VAPID_PUBLIC_KEY) {
      console.error("VAPID public key not found");
      return;
    }

    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      // Send to backend
      const response = await fetch("/api/v1/notifications/push-subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("ldi_token")}`,
        },
        body: JSON.stringify({ subscription: sub, action: "subscribe" }),
      });

      if (!response.ok)
        throw new Error("Failed to save subscription on backend");

      setSubscription(sub);
      setPermission(Notification.permission);
      return sub;
    } catch (err) {
      console.error("Subscription error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async () => {
    if (!subscription) return;

    setLoading(true);
    try {
      await subscription.unsubscribe();

      // Notify backend
      await fetch("/api/v1/notifications/push-subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("ldi_token")}`,
        },
        body: JSON.stringify({ subscription, action: "unsubscribe" }),
      });

      setSubscription(null);
    } catch (err) {
      console.error("Unsubscribe error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    subscription,
    isSupported,
    loading,
    permission,
    subscribe,
    unsubscribe,
  };
}
