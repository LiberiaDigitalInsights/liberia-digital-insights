import { describe, it, expect, vi, afterEach } from 'vitest';
import { subscribeNewsletter } from '../newsletter';
import { backendApi } from '../../services/backendApi';

vi.mock('../../services/backendApi', () => ({
  backendApi: {
    newsletters: {
      subscribe: vi.fn(),
    },
  },
}));

describe('subscribeNewsletter', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('resolves on valid input', async () => {
    const mockResponse = { ok: true };
    vi.mocked(backendApi.newsletters.subscribe).mockResolvedValue(mockResponse);

    const payload = { name: 'Ada', email: 'ada@example.com' };
    const result = await subscribeNewsletter(payload);

    expect(result).toEqual(mockResponse);
    expect(backendApi.newsletters.subscribe).toHaveBeenCalledWith(payload);
  });

  it('rejects with NETWORK_ERROR when API fails', async () => {
    const error = new Error('Network error');
    error.code = 'NETWORK_ERROR';
    vi.mocked(backendApi.newsletters.subscribe).mockRejectedValue(error);

    const promise = subscribeNewsletter({ name: 'Ada', email: 'ada@example.com' });
    await expect(promise).rejects.toThrow('Network error');
  });

  it('rejects with VALIDATION_ERROR for invalid input', async () => {
    const error = new Error('Validation error');
    error.code = 'VALIDATION_ERROR';
    vi.mocked(backendApi.newsletters.subscribe).mockRejectedValue(error);

    const promise = subscribeNewsletter({ name: '', email: 'bad' });
    await expect(promise).rejects.toThrow('Validation error');
  });
});
