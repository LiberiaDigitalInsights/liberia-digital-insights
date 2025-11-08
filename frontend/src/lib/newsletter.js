export async function subscribeNewsletter(payload) {
  // Simulate latency and random outcome
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));
  await delay(600);

  // Very basic mock validation and occasional failure
  const email = String(payload?.email || '');
  const name = String(payload?.name || '');
  const emailOk = /.+@.+\..+/.test(email);
  if (!name || !emailOk) {
    const err = new Error('Invalid input');
    err.code = 'VALIDATION_ERROR';
    throw err;
  }

  if (Math.random() < 0.1) {
    const err = new Error('Network error');
    err.code = 'NETWORK_ERROR';
    throw err;
  }

  return { ok: true };
}
