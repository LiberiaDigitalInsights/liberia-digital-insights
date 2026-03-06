export async function uploadFile(
  file,
  { type = "images", path = "misc" } = {},
) {
  if (!file) throw new Error("No file provided");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);
  formData.append("path", path);

  const res = await fetch("/api/v1/upload", {
    method: "POST",
    headers: {
      // Authorization header is handled by apiRequest if needed,
      // but here we are using native fetch.
      // We should match the apiRequest behavior for auth tokens.
      ...(typeof window !== "undefined" && localStorage.getItem("ldi_token")
        ? { Authorization: `Bearer ${localStorage.getItem("ldi_token")}` }
        : {}),
    },
    body: formData,
  });

  if (!res.ok) {
    let msg = `Upload failed (${res.status})`;
    try {
      const err = await res.json();
      if (err?.error) msg = err.error;
    } catch {
      /* empty */
    }
    throw new Error(msg);
  }

  return res.json(); // { path, url, filename, size, type }
}
