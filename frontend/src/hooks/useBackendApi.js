import { useState, useEffect, useCallback, useMemo } from 'react';
import { backendApi, authApi } from '../services/backendApi';

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
        setError(err.message || 'An error occurred');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

// Hook for authentication
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = authApi.getToken();
    if (token) {
      // Verify token and get user info
      authApi
        .verify(token)
        .then((response) => {
          setUser(response.user);
          setIsAuthenticated(true);
        })
        .catch(() => {
          authApi.clearToken();
        })
        .finally(() => {
          setLoading(false);
        });
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

  const register = useCallback(async (userData) => {
    const response = await authApi.register(userData);
    return response;
  }, []);

  const logout = useCallback(() => {
    authApi.clearToken();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  };
};

// Hook for articles
export const useArticles = (params = {}) => {
  return useApi(() => backendApi.articles.list(params), [JSON.stringify(params)]);
};

// Hook for single article
export const useArticle = (slug) => {
  return useApi(() => backendApi.articles.getBySlug(slug), [slug], { immediate: !!slug });
};

// Hook for insights
export const useInsights = (params = {}) => {
  return useApi(() => backendApi.insights.list(params), [JSON.stringify(params)]);
};

// Hook for single insight
export const useInsight = (slug) => {
  return useApi(() => backendApi.insights.getBySlug(slug), [slug], { immediate: !!slug });
};

// Hook for podcasts
export const usePodcasts = (params = {}) => {
  return useApi(() => backendApi.podcasts.list(params), [JSON.stringify(params)]);
};

// Hook for single podcast
export const usePodcast = (slug) => {
  return useApi(() => backendApi.podcasts.getBySlug(slug), [slug], { immediate: !!slug });
};

// Hook for events
export const useEvents = (params = {}) => {
  return useApi(() => backendApi.events.list(params), [JSON.stringify(params)]);
};

// Hook for single event
export const useEvent = (slug) => {
  return useApi(() => backendApi.events.getBySlug(slug), [slug], { immediate: !!slug });
};

// Hook for advertisements
export const useAdvertisements = (params = {}) => {
  return useApi(() => backendApi.advertisements.list(params), [JSON.stringify(params)]);
};

// Hook for single advertisement
export const useAdvertisement = (slug) => {
  return useApi(() => backendApi.advertisements.getBySlug(slug), [slug], { immediate: !!slug });
};

// Hook for talents
export const useTalents = (params = {}) => {
  // Clean params to ensure only serializable values
  const cleanParams = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && value !== null) {
        // If it's an object, try to extract a meaningful string value
        if (value.toString && value.toString() !== '[object Object]') {
          cleanParams[key] = value.toString();
        } else if (value.value) {
          cleanParams[key] = String(value.value);
        } else if (value.target && value.target.value) {
          cleanParams[key] = String(value.target.value);
        }
      } else {
        cleanParams[key] = String(value);
      }
    }
  });

  return useApi(() => backendApi.talents.list(cleanParams), [JSON.stringify(cleanParams)]);
};

// Hook for single talent
export const useTalent = (slug) => {
  return useApi(() => backendApi.talents.getBySlug(slug), [slug], { immediate: !!slug });
};

// Hook for training courses
export const useTraining = (params = {}) => {
  return useApi(() => backendApi.training.list(params), [JSON.stringify(params)]);
};

// Hook for single training course
export const useTrainingCourse = (slug) => {
  return useApi(() => backendApi.training.getBySlug(slug), [slug], { immediate: !!slug });
};

// Hook for single training course by ID
export const useTrainingById = (id) => {
  return useApi(
    () => {
      console.log('Fetching training with ID:', id);
      return backendApi.training.getById(id);
    },
    [id],
    { immediate: !!id },
  );
};

// Hook for newsletters
export const useNewsletters = (params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const paramsString = JSON.stringify(params);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoParams = useMemo(() => params, [paramsString]);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await backendApi.newsletters.list(memoParams);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to fetch newsletters');
      // Don't throw error, just set error state
    } finally {
      setLoading(false);
    }
  }, [memoParams]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
};

// Hook for newsletter templates
export const useNewsletterTemplates = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await backendApi.newsletters.getTemplates();
        setData(result);
      } catch (err) {
        setError(err.message || 'Failed to fetch templates');
        // Don't throw error, just set error state
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  return { data, loading, error };
};

// Hook for newsletter subscribers
export const useNewsletterSubscribers = (params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const paramsString = JSON.stringify(params);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoParams = useMemo(() => params, [paramsString]);

  useEffect(() => {
    const fetchSubscribers = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await backendApi.newsletters.getSubscribers(memoParams);
        setData(result);
      } catch (err) {
        setError(err.message || 'Failed to fetch subscribers');
        // Don't throw error, just set error state
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, [memoParams]);

  return { data, loading, error };
};

// Hook for newsletter statistics
export const useNewsletterStats = (newsletterId) => {
  return useApi(() => backendApi.newsletters.getStats(newsletterId), [newsletterId], {
    immediate: !!newsletterId,
  });
};

// Hook for newsletter replies
export const useNewsletterReplies = (newsletterId) => {
  return useApi(() => backendApi.newsletters.getReplies(newsletterId), [newsletterId], {
    immediate: !!newsletterId,
  });
};

// Hook for categories
export const useCategories = () => {
  return useApi(() => backendApi.categories.list(), []);
};

// Hook for file upload
export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFile = useCallback(async (dataUrl, folder = 'uploads') => {
    setUploading(true);
    setError(null);

    try {
      const result = await backendApi.upload.uploadFile(dataUrl, folder);
      return result;
    } catch (err) {
      setError(err.message || 'Upload failed');
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  return {
    uploadFile,
    uploading,
    error,
  };
};

// Hook for newsletter subscribers list
export const useNewsletterSubscribersList = (params = {}) => {
  const paramsString = JSON.stringify(params);
  return useApi(() => backendApi.newsletters.getSubscribersList(params), [paramsString]);
};

// Hook for newsletter subscription
export const useNewsletterSubscription = () => {
  const [activeRequests, setActiveRequests] = useState(0);
  const [error, setError] = useState(null);

  const subscribe = useCallback(async (subscriberData) => {
    setActiveRequests((prev) => prev + 1);
    setError(null);
    try {
      const result = await backendApi.newsletters.subscribe(subscriberData);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to subscribe to newsletter');
      throw err;
    } finally {
      setActiveRequests((prev) => prev - 1);
    }
  }, []);

  return {
    subscribe,
    loading: activeRequests > 0,
    error,
  };
};

// Hook for newsletter analytics
export const useNewsletterAnalytics = () => {
  return useApi(() => backendApi.newsletters.getAnalytics(), [], { immediate: true });
};

// Hook for health check
export const useHealthCheck = () => {
  return useApi(() => backendApi.health.check(), [], { immediate: true });
};

export default {
  useArticles,
  useArticle,
  usePodcasts,
  usePodcast,
  useEvents,
  useEvent,
  useAdvertisements,
  useAdvertisement,
  useTalents,
  useTalent,
  useTraining,
  useTrainingCourse,
  useTrainingById,
  useNewsletters,
  useNewsletterTemplates,
  useNewsletterSubscribers,
  useNewsletterStats,
  useNewsletterReplies,
  useNewsletterSubscription,
  useNewsletterSubscribersList,
  useNewsletterAnalytics,
  useCategories,
  useFileUpload,
  useHealthCheck,
};
