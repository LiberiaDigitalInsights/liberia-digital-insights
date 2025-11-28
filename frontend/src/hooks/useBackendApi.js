import { useState, useEffect, useCallback } from 'react';
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

// Hook for newsletters
export const useNewsletters = (params = {}) => {
  return useApi(() => backendApi.newsletters.list(params), [JSON.stringify(params)]);
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

// Hook for health check
export const useHealthCheck = () => {
  return useApi(() => backendApi.health.check(), [], { immediate: true });
};

export default {
  useApi,
  useAuth,
  useArticles,
  useArticle,
  useInsights,
  useInsight,
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
  useNewsletters,
  useCategories,
  useFileUpload,
  useHealthCheck,
};
