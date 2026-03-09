"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

// Generic API request function with retry mechanism
export const apiRequest = async (endpoint, options = {}, retries = 2) => {
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

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  for (let i = 0; i <= retries; i++) {
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
      const isNetworkError =
        error.name === "TypeError" || // fetch failed
        error.name === "ConnectTimeoutError" ||
        error.code === "EAI_AGAIN";

      if (i < retries && isNetworkError) {
        console.warn(
          `API retry ${i + 1}/${retries} for [${endpoint}]:`,
          error.message,
        );
        await delay(1000 * (i + 1)); // Exponential-ish backoff
        continue;
      }

      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
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
  }, [...dependencies, options.immediate]);

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

export const useArticleById = (id) => {
  return useApi(() => apiRequest(`/articles/${id}`), [id], {
    immediate: !!id,
  });
};

// Mutation functions for articles
export const createArticle = (articleData) =>
  apiRequest("/articles", {
    method: "POST",
    body: JSON.stringify(articleData),
  });

export const updateArticle = (id, articleData) =>
  apiRequest(`/articles/${id}`, {
    method: "PUT",
    body: JSON.stringify(articleData),
  });

export const deleteArticle = (id) =>
  apiRequest(`/articles/${id}`, {
    method: "DELETE",
  });

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

export const usePodcastById = (id) => {
  return useApi(() => apiRequest(`/podcasts/${id}`), [id], {
    immediate: !!id,
  });
};

// Mutation functions for podcasts
export const createPodcast = (podcastData) =>
  apiRequest("/podcasts", {
    method: "POST",
    body: JSON.stringify(podcastData),
  });

export const updatePodcast = (id, podcastData) =>
  apiRequest(`/podcasts/${id}`, {
    method: "PUT",
    body: JSON.stringify(podcastData),
  });

export const deletePodcast = (id) =>
  apiRequest(`/podcasts/${id}`, {
    method: "DELETE",
  });

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

export const useEventById = (id) => {
  return useApi(() => apiRequest(`/events/${id}`), [id], {
    immediate: !!id,
  });
};

// Mutation functions for events
export const createEvent = (eventData) =>
  apiRequest("/events", {
    method: "POST",
    body: JSON.stringify(eventData),
  });

export const updateEvent = (id, eventData) =>
  apiRequest(`/events/${id}`, {
    method: "PUT",
    body: JSON.stringify(eventData),
  });

export const deleteEvent = (id) =>
  apiRequest(`/events/${id}`, {
    method: "DELETE",
  });

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

export const useInsightById = (id) => {
  return useApi(() => apiRequest(`/insights/${id}`), [id], {
    immediate: !!id,
  });
};

// Mutation functions for insights
export const createInsight = (insightData) =>
  apiRequest("/insights", {
    method: "POST",
    body: JSON.stringify(insightData),
  });

export const updateInsight = (id, insightData) =>
  apiRequest(`/insights/${id}`, {
    method: "PUT",
    body: JSON.stringify(insightData),
  });

export const deleteInsight = (id) =>
  apiRequest(`/insights/${id}`, {
    method: "DELETE",
  });

// Hook for newsletters
export const useNewsletters = (params = {}) => {
  const query = new URLSearchParams(cleanParams(params)).toString();
  return useApi(
    () => apiRequest(`/newsletters${query ? `?${query}` : ""}`),
    [query],
  );
};

// Hook for newsletter subscribers (Admin-only dedicated endpoint)
export const useNewsletterSubscribers = (params = {}) => {
  const query = new URLSearchParams(cleanParams(params)).toString();
  return useApi(
    () => apiRequest(`/newsletters/subscribers${query ? `?${query}` : ""}`),
    [query],
  );
};

export const updateSubscriberStatus = (id, status) =>
  apiRequest(`/newsletters/subscribers/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });

export const useNewsletterTemplates = () => {
  return useApi(() => apiRequest("/newsletters/templates"), []);
};

export const createNewsletter = (newsletterData) =>
  apiRequest("/newsletters", {
    method: "POST",
    body: JSON.stringify(newsletterData),
  });

export const updateNewsletter = (id, newsletterData) =>
  apiRequest(`/newsletters/${id}`, {
    method: "PUT",
    body: JSON.stringify(newsletterData),
  });

export const deleteNewsletter = (id) =>
  apiRequest(`/newsletters/${id}`, {
    method: "DELETE",
  });

// Hook for advertisements
export const useAdvertisements = (params = {}) => {
  const query = new URLSearchParams(cleanParams(params)).toString();
  return useApi(
    () => apiRequest(`/advertisements${query ? `?${query}` : ""}`),
    [query],
  );
};

// Mutation functions for advertisements
export const createAdvertisement = (adData) =>
  apiRequest("/advertisements", {
    method: "POST",
    body: JSON.stringify(adData),
  });

export const updateAdvertisement = (id, adData) =>
  apiRequest(`/advertisements/${id}`, {
    method: "PUT",
    body: JSON.stringify(adData),
  });

export const deleteAdvertisement = (id) =>
  apiRequest(`/advertisements/${id}`, {
    method: "DELETE",
  });

// Hook for gallery items
export const useGallery = (params = {}) => {
  const query = new URLSearchParams(cleanParams(params)).toString();
  return useApi(
    () => apiRequest(`/gallery${query ? `?${query}` : ""}`),
    [query],
  );
};

export const useGalleryCategories = () => {
  return useApi(() => apiRequest("/gallery/categories"), []);
};

export const createGalleryCategory = (categoryData) =>
  apiRequest("/gallery/categories", {
    method: "POST",
    body: JSON.stringify(categoryData),
  });

export const deleteGalleryCategory = (id) =>
  apiRequest(`/gallery/categories/${id}`, {
    method: "DELETE",
  });

// Mutation functions for gallery
export const createGalleryItem = (itemData) =>
  apiRequest("/gallery", {
    method: "POST",
    body: JSON.stringify(itemData),
  });

export const updateGalleryItem = (id, itemData) =>
  apiRequest(`/gallery/${id}`, {
    method: "PUT",
    body: JSON.stringify(itemData),
  });

export const deleteGalleryItem = (id) =>
  apiRequest(`/gallery/${id}`, {
    method: "DELETE",
  });

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

// Mutation functions for newsletter (Admin)
export const sendNewsletter = (campaignData) =>
  apiRequest("/newsletters/send", {
    method: "POST",
    body: JSON.stringify(campaignData),
  });

export const deleteSubscriber = (id) =>
  apiRequest(`/newsletters/subscribers/${id}`, {
    method: "DELETE",
  });

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

// Mutation functions for training
export const createTrainingCourse = (courseData) =>
  apiRequest("/training", {
    method: "POST",
    body: JSON.stringify(courseData),
  });

export const updateTrainingCourse = (id, courseData) =>
  apiRequest(`/training/${id}`, {
    method: "PUT",
    body: JSON.stringify(courseData),
  });

export const deleteTrainingCourse = (id) =>
  apiRequest(`/training/${id}`, {
    method: "DELETE",
  });

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

// Hook for recent activity (Admin only)
export const useRecentActivity = () => {
  return useApi(() => apiRequest("/analytics/activity"), []);
};

// Hook for settings
export const useSettings = () => {
  return useApi(() => apiRequest("/settings"), []);
};

export const updateSettings = (settingsData) =>
  apiRequest("/settings", {
    method: "PUT",
    body: JSON.stringify(settingsData),
  });

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

// Hook for users list (Admin)
export const useUsers = (params = {}) => {
  const query = new URLSearchParams(cleanParams(params)).toString();
  return useApi(() => apiRequest(`/users${query ? `?${query}` : ""}`), [query]);
};

// Mutation functions for users
export const updateUserRole = (id, role) =>
  apiRequest(`/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });

export const updateUserStatus = (id, is_active) =>
  apiRequest(`/users/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ is_active }),
  });

export const deleteUser = (id) =>
  apiRequest(`/users/${id}`, {
    method: "DELETE",
  });

// Mutation functions for talents
export const createTalent = (talentData) =>
  apiRequest("/talents", {
    method: "POST",
    body: JSON.stringify(talentData),
  });

export const updateTalent = (id, talentData) =>
  apiRequest(`/talents/${id}`, {
    method: "PUT",
    body: JSON.stringify(talentData),
  });

export const deleteTalent = (id) =>
  apiRequest(`/talents/${id}`, {
    method: "DELETE",
  });

// UI export
export default {
  useAuth,
  useArticles,
  useArticle,
  useArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  usePodcasts,
  usePodcast,
  usePodcastById,
  createPodcast,
  updatePodcast,
  deletePodcast,
  useEvents,
  useEvent,
  useEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  useInsights,
  useInsight,
  useInsightById,
  createInsight,
  updateInsight,
  deleteInsight,
  useNewsletters,
  useAdvertisements,
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
  useGallery,
  useGalleryCategories,
  createGalleryCategory,
  deleteGalleryCategory,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  useNewsletterSubscription,
  useNewsletterSubscribers,
  sendNewsletter,
  deleteSubscriber,
  updateSubscriberStatus,
  useNewsletterTemplates,
  createNewsletter,
  updateNewsletter,
  deleteNewsletter,
  useTrainingById,
  useTraining,
  createTrainingCourse,
  updateTrainingCourse,
  deleteTrainingCourse,
  useTalents,
  useCategories,
  useUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  createTalent,
  updateTalent,
  deleteTalent,
  useAnalyticsStats,
  useRecentActivity,
  useSettings,
  updateSettings,
  useBookmarks,
  addBookmark,
  removeBookmark,
};
