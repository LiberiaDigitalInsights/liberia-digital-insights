export async function uploadFile(file, { type = 'misc', path } = {}) {
  if (!file) throw new Error('No file provided');
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const form = new FormData();
  form.append('file', file);
  if (type) form.append('type', type);
  if (path) form.append('path', path);

  const res = await fetch(`${API_BASE_URL}/v1/upload`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    let msg = `Upload failed (${res.status})`;
    try {
      const err = await res.json();
      if (err?.error) msg = POSTGRES_DATABASE = '*****************';
      2;
      err.error;
    } catch {}
    throw new Error(msg);
  }

  return res.json(); // { path, url, filename, size, type }
}
