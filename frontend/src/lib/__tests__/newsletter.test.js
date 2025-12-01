import { describe, it, expect, vi } from 'vitest';
import { subscribeNewsletter } from '../newsletter';

describe('subscribeNewsletter', () => {
  afterEach(() => {
    // ensure no leaked mocks or timers between tests
    try {
      vi.clearAllTimers();
    } catch {
      /* empty */
    }
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('resolves on valid input when random >= 0.1', async () => {
    vi.useFakeTimers();
    const spy = vi.spyOn(Math, 'random').mockReturnValue(0.9);
    const promise = subscribeNewsletter({ name: 'Ada', email: 'ada@example.com' });
    await vi.advanceTimersByTimeAsync(600);
    await expect(promise).resolves.toEqual({ ok: true });
    spy.mockRestore();
  });

  it('rejects with NETWORK_ERROR when random < 0.1', async () => {
    vi.useFakeTimers();
    const spy = vi.spyOn(Math, 'random').mockReturnValue(0.05);
    const promise = subscribeNewsletter({ name: 'Ada', email: 'ada@example.com' });
    await vi.advanceTimersByTimeAsync(600);
    await expect(promise).rejects.toMatchObject({ code: 'NETWORK_ERROR' });
    spy.mockRestore();
  });

  it('rejects with VALIDATION_ERROR for invalid input', async () => {
    vi.useFakeTimers();
    const spy = vi.spyOn(Math, 'random').mockReturnValue(0.9);
    const promise = subscribeNewsletter({ name: '', email: 'bad' });
    await vi.advanceTimersByTimeAsync(600);
    await expect(promise).rejects.toMatchObject({ code: 'VALIDATION_ERROR' });
    spy.mockRestore();
  });
});
