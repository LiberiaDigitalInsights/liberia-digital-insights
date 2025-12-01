// useNewsletterSubscription Hook Tests
import { renderHook, act } from '@testing-library/react';
import { useNewsletterSubscription } from '../useBackendApi';
import { backendApi } from '../../services/backendApi';

// Mock the backend API
jest.mock('../../services/backendApi');

const mockBackendApi = backendApi;

describe('useNewsletterSubscription', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    mockBackendApi.newsletters.subscribe.mockResolvedValue({ message: 'Success' });

    const { result } = renderHook(() => useNewsletterSubscription());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.subscribe).toBe('function');
  });

  it('should handle successful subscription', async () => {
    const mockResponse = {
      message: 'Successfully subscribed',
      subscriber: {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com'
      }
    };

    mockBackendApi.newsletters.subscribe.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useNewsletterSubscription());

    const subscriberData = {
      name: 'John Doe',
      email: 'john@example.com',
      company: 'Tech Corp',
      org: 'Tech Org',
      position: 'Developer'
    };

    await act(async () => {
      const response = await result.current.subscribe(subscriberData);
      expect(response).toEqual(mockResponse);
    });

    expect(mockBackendApi.newsletters.subscribe).toHaveBeenCalledWith(subscriberData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should set loading state during subscription', async () => {
    mockBackendApi.newsletters.subscribe.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ message: 'Success' }), 100))
    );

    const { result } = renderHook(() => useNewsletterSubscription());

    act(() => {
      result.current.subscribe({
        name: 'John Doe',
        email: 'john@example.com'
      });
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it('should handle subscription error', async () => {
    const mockError = new Error('Network error');
    mockBackendApi.newsletters.subscribe.mockRejectedValue(mockError);

    const { result } = renderHook(() => useNewsletterSubscription());

    const subscriberData = {
      name: 'John Doe',
      email: 'john@example.com'
    };

    await act(async () => {
      try {
        await result.current.subscribe(subscriberData);
      } catch (error) {
        expect(error).toBe(mockError);
      }
    });

    expect(mockBackendApi.newsletters.subscribe).toHaveBeenCalledWith(subscriberData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Network error');
  });

  it('should handle error without message', async () => {
    const mockError = new Error();
    mockBackendApi.newsletters.subscribe.mockRejectedValue(mockError);

    const { result } = renderHook(() => useNewsletterSubscription());

    await act(async () => {
      try {
        await result.current.subscribe({
          name: 'John Doe',
          email: 'john@example.com'
        });
      } catch (error) {
        expect(error).toBe(mockError);
      }
    });

    expect(result.current.error).toBe('Failed to subscribe to newsletter');
  });

  it('should reset error state on successful subscription after error', async () => {
    // First call fails
    mockBackendApi.newsletters.subscribe.mockRejectedValueOnce(new Error('First error'));
    
    const { result } = renderHook(() => useNewsletterSubscription());

    // First subscription attempt fails
    await act(async () => {
      try {
        await result.current.subscribe({
          name: 'John Doe',
          email: 'john@example.com'
        });
      } catch {
        // Expected to fail
      }
    });

    expect(result.current.error).toBe('First error');

    // Second call succeeds
    mockBackendApi.newsletters.subscribe.mockResolvedValueOnce({ message: 'Success' });
    
    await act(async () => {
      await result.current.subscribe({
        name: 'Jane Doe',
        email: 'jane@example.com'
      });
    });

    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(false);
  });

  it('should maintain loading state correctly with multiple concurrent calls', async () => {
    let resolveFirst;
    let resolveSecond;

    mockBackendApi.newsletters.subscribe.mockImplementation((data) => {
      if (data.email === 'first@example.com') {
        return new Promise(resolve => {
          resolveFirst = resolve;
        });
      } else if (data.email === 'second@example.com') {
        return new Promise(resolve => {
          resolveSecond = resolve;
        });
      }
      return Promise.resolve({ message: 'Success' });
    });

    const { result } = renderHook(() => useNewsletterSubscription());

    // Start first subscription
    act(() => {
      result.current.subscribe({
        name: 'First User',
        email: 'first@example.com'
      });
    });

    expect(result.current.loading).toBe(true);

    // Start second subscription while first is still loading
    act(() => {
      result.current.subscribe({
        name: 'Second User',
        email: 'second@example.com'
      });
    });

    expect(result.current.loading).toBe(true);

    // Resolve second subscription first
    await act(async () => {
      resolveSecond({ message: 'Success' });
    });

    // Should still be loading due to first subscription
    expect(result.current.loading).toBe(true);

    // Resolve first subscription
    await act(async () => {
      resolveFirst({ message: 'Success' });
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should pass subscriber data correctly to API', async () => {
    mockBackendApi.newsletters.subscribe.mockResolvedValue({ message: 'Success' });

    const { result } = renderHook(() => useNewsletterSubscription());

    const subscriberData = {
      name: 'John Doe',
      email: 'john@example.com',
      company: 'Tech Corp',
      org: 'Tech Org',
      position: 'Senior Developer'
    };

    await act(async () => {
      await result.current.subscribe(subscriberData);
    });

    expect(mockBackendApi.newsletters.subscribe).toHaveBeenCalledWith(subscriberData);
    expect(mockBackendApi.newsletters.subscribe).toHaveBeenCalledTimes(1);
  });

  it('should handle empty subscriber data', async () => {
    mockBackendApi.newsletters.subscribe.mockResolvedValue({ message: 'Success' });

    const { result } = renderHook(() => useNewsletterSubscription());

    const emptyData = {
      name: '',
      email: '',
      company: '',
      org: '',
      position: ''
    };

    await act(async () => {
      await result.current.subscribe(emptyData);
    });

    expect(mockBackendApi.newsletters.subscribe).toHaveBeenCalledWith(emptyData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });
});
