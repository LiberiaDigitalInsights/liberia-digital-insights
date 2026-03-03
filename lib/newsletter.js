"use client";

export async function subscribeNewsletter(data) {
  // Placeholder logic till we port the full backendApi
  console.log("Newsletter subscription request:", data);
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { success: true };
}
