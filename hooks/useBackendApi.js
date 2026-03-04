"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

// Generic API request function
export const apiRequest = async (endpoint, options = {}) => {
  const url = endpoint.startsWith("http") ? endpoint : `/api/v1${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available (match legacy behavior)
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("ldi_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const errorMessage =
        error.error ||
        error.message ||
        `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    if (response.status === 204) return null;
    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};

// Authentication API (Internal helper)
export const authApi = {
  login: (credentials) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  register: (userData) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
  verify: (token) =>
    apiRequest("/auth/verify", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),
  setToken: (token) => localStorage.setItem("ldi_token", token),
  getToken: () => localStorage.getItem("ldi_token"),
  clearToken: () => localStorage.removeItem("ldi_token"),
};

// Generic hook for API data fetching
export const useApi = (apiFunction, dependencies = [], options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFunction(...args);
        setData(result);
        return result;
      } catch (err) {
        setError(err.message || "An error occurred");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction],
  );

  useEffect(() => {
    if (options.immediate !== false) {
      fetchData();
    }
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
};

// Hook for authentication
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = authApi.getToken();
    if (token) {
      authApi
        .verify(token)
        .then((response) => {
          setUser(response.user);
          setIsAuthenticated(true);
        })
        .catch(() => authApi.clearToken())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    const response = await authApi.login(credentials);
    authApi.setToken(response.token);
    setUser(response.user);
    setIsAuthenticated(true);
    return response;
  }, []);

  const register = useCallback((userData) => authApi.register(userData), []);
  const logout = useCallback(() => {
    authApi.clearToken();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return { user, loading, isAuthenticated, login, register, logout };
};

// Helper to remove undefined/null values from params
const cleanParams = (params) => {
  const cleaned = {};
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null) {
      cleaned[key] = params[key];
    }
  });
  return cleaned;
};

// Hook for articles
export const useArticles = (params = {}) => {
  const query = new URLSearchParams(cleanParams(params)).toString();
  return useApi(
    () => apiRequest(`/articles${query ? `?${query}` : ""}`),
    [query],
  );
};

// Hook for single article
export const useArticle = (slug) => {
  return useApi(() => apiRequest(`/articles/slug/${slug}`), [slug], {
    immediate: !!slug,
  });
};

// Hook for podcasts
export const usePodcasts = (params = {}) => {
  const query = new URLSearchParams(cleanParams(params)).toString();
  return useApi(
    () => apiRequest(`/podcasts${query ? `?${query}` : ""}`),
    [query],
  );
};

// Hook for single podcast
export const usePodcast = (slug) => {
  return useApi(() => apiRequest(`/podcasts/slug/${slug}`), [slug], {
    immediate: !!slug,
  });
};

// Hook for events
export const useEvents = (params = {}) => {
  const query = new URLSearchParams(cleanParams(params)).toString();
  return useApi(
    () => apiRequest(`/events${query ? `?${query}` : ""}`),
    [query],
  );
};

// Hook for single event
export const useEvent = (slug) => {
  return useApi(() => apiRequest(`/events/slug/${slug}`), [slug], {
    immediate: !!slug,
  });
};

// Hook for insights
export const useInsights = (params = {}) => {
  const query = new URLSearchParams(cleanParams(params)).toString();
  return useApi(
    () => apiRequest(`/insights${query ? `?${query}` : ""}`),
    [query],
  );
};

// Hook for single insight
export const useInsight = (slug) => {
  return useApi(() => apiRequest(`/insights/slug/${slug}`), [slug], {
    immediate: !!slug,
  });
};

// Hook for newsletters
export const useNewsletters = (params = {}) => {
  const query = new URLSearchParams(cleanParams(params)).toString();
  return useApi(
    () => apiRequest(`/newsletters${query ? `?${query}` : ""}`),
    [query],
  );
};

// Hook for advertisements
export const useAdvertisements = (params = {}) => {
  const query = new URLSearchParams(cleanParams(params)).toString();
  return useApi(
    () => apiRequest(`/advertisements${query ? `?${query}` : ""}`),
    [query],
  );
};

// Hook for categories
export const useCategories = () => {
  return useApi(() => apiRequest("/categories"), []);
};

// Hook for newsletter subscription
export const useNewsletterSubscription = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const subscribe = useCallback(async (subscriberData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiRequest("/newsletters/subscribe", {
        method: "POST",
        body: JSON.stringify(subscriberData),
      });
      return result;
    } catch (err) {
      setError(err.message || "Failed to subscribe to newsletter");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { subscribe, loading, error };
};

// Hook for training
export const useTraining = (params = {}) => {
  const query = new URLSearchParams(cleanParams(params)).toString();
  return useApi(
    () => apiRequest(`/training${query ? `?${query}` : ""}`),
    [query],
  );
};

// Hook for training course by ID
export const useTrainingById = (id) => {
  return useApi(() => apiRequest(`/training/${id}`), [id], { immediate: !!id });
};

// Hook for talents
export const useTalents = (params = {}) => {
  const query = new URLSearchParams(cleanParams(params)).toString();
  return useApi(
    () => apiRequest(`/talents${query ? `?${query}` : ""}`),
    [query],
  );
};

// Hook for analytics stats (Admin only)
export const useAnalyticsStats = () => {
  return useApi(() => apiRequest("/analytics/stats"), []);
};

// Hook for bookmarks
export const useBookmarks = (params = {}, options = {}) => {
  const query = new URLSearchParams(cleanParams(params)).toString();
  return useApi(
    () => apiRequest(`/bookmarks${query ? `?${query}` : ""}`),
    [query],
    options,
  );
};

// Mutation functions for bookmarks
export const addBookmark = (contentId, contentType) =>
  apiRequest("/bookmarks", {
    method: "POST",
    body: JSON.stringify({ content_id: contentId, content_type: contentType }),
  });

export const removeBookmark = (bookmarkId) =>
  apiRequest(`/bookmarks/${bookmarkId}`, {
    method: "DELETE",
  });

// UI export
export default {
  useAuth,
  useArticles,
  useArticle,
  usePodcasts,
  usePodcast,
  useEvents,
  useEvent,
  useInsights,
  useInsight,
  useNewsletters,
  useAdvertisements,
  useNewsletterSubscription,
  useTrainingById,
  useTraining,
  useTalents,
  useCategories,
  useAnalyticsStats,
  useBookmarks,
  addBookmark,
  removeBookmark,
};
