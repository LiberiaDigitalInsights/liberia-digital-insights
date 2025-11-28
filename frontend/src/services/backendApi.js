// Backend API service for Liberia Digital Insights
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('ldi_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};

// Authentication API
export const authApi = {
  async login(credentials) {
    return apiRequest('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async register(userData) {
    return apiRequest('/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async verify(token) {
    return apiRequest('/v1/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },

  // Store auth token in localStorage
  setToken(token) {
    localStorage.setItem('ldi_token', token);
  },

  // Get auth token from localStorage
  getToken() {
    return localStorage.getItem('ldi_token');
  },

  // Remove auth token (logout)
  clearToken() {
    localStorage.removeItem('ldi_token');
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  },
};

// Articles API
export const articlesApi = {
  async list(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/v1/articles${query ? `?${query}` : ''}`);
  },

  async getBySlug(slug) {
    return apiRequest(`/v1/articles/slug/${slug}`);
  },

  async create(articleData) {
    return apiRequest('/v1/articles', {
      method: 'POST',
      body: JSON.stringify(articleData),
    });
  },

  async update(id, articleData) {
    return apiRequest(`/v1/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(articleData),
    });
  },

  async delete(id) {
    return apiRequest(`/v1/articles/${id}`, {
      method: 'DELETE',
    });
  },
};

// Insights API
export const insightsApi = {
  async list(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/v1/insights${query ? `?${query}` : ''}`);
  },

  async getBySlug(slug) {
    return apiRequest(`/v1/insights/slug/${slug}`);
  },

  async create(insightData) {
    return apiRequest('/v1/insights', {
      method: 'POST',
      body: JSON.stringify(insightData),
    });
  },

  async update(id, insightData) {
    return apiRequest(`/v1/insights/${id}`, {
      method: 'PUT',
      body: JSON.stringify(insightData),
    });
  },

  async delete(id) {
    return apiRequest(`/v1/insights/${id}`, {
      method: 'DELETE',
    });
  },
};

// Podcasts API
export const podcastsApi = {
  async list(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/v1/podcasts${query ? `?${query}` : ''}`);
  },

  async getBySlug(slug) {
    return apiRequest(`/v1/podcasts/slug/${slug}`);
  },

  async create(podcastData) {
    return apiRequest('/v1/podcasts', {
      method: 'POST',
      body: JSON.stringify(podcastData),
    });
  },

  async update(id, podcastData) {
    return apiRequest(`/v1/podcasts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(podcastData),
    });
  },

  async delete(id) {
    return apiRequest(`/v1/podcasts/${id}`, {
      method: 'DELETE',
    });
  },
};

// Events API
export const eventsApi = {
  async list(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/v1/events${query ? `?${query}` : ''}`);
  },

  async getBySlug(slug) {
    return apiRequest(`/v1/events/slug/${slug}`);
  },

  async create(eventData) {
    return apiRequest('/v1/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  async update(id, eventData) {
    return apiRequest(`/v1/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  },

  async delete(id) {
    return apiRequest(`/v1/events/${id}`, {
      method: 'DELETE',
    });
  },
};

// Training API
export const trainingApi = {
  async list(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/v1/training${query ? `?${query}` : ''}`);
  },

  async getBySlug(slug) {
    return apiRequest(`/v1/training/${slug}`);
  },

  async create(trainingData) {
    return apiRequest('/v1/training', {
      method: 'POST',
      body: JSON.stringify(trainingData),
    });
  },

  async update(id, trainingData) {
    return apiRequest(`/v1/training/${id}`, {
      method: 'PUT',
      body: JSON.stringify(trainingData),
    });
  },

  async delete(id) {
    return apiRequest(`/v1/training/${id}`, {
      method: 'DELETE',
    });
  },
};

// Newsletters API
export const newslettersApi = {
  async list(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/v1/newsletters${query ? `?${query}` : ''}`);
  },

  async create(newsletterData) {
    return apiRequest('/v1/newsletters', {
      method: 'POST',
      body: JSON.stringify(newsletterData),
    });
  },

  async update(id, newsletterData) {
    return apiRequest(`/v1/newsletters/${id}`, {
      method: 'PUT',
      body: JSON.stringify(newsletterData),
    });
  },

  async delete(id) {
    return apiRequest(`/v1/newsletters/${id}`, {
      method: 'DELETE',
    });
  },
};

// Categories API
export const categoriesApi = {
  async list() {
    return apiRequest('/v1/categories');
  },
};

// Advertisements API
export const advertisementsApi = {
  async list(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/v1/advertisements${query ? `?${query}` : ''}`);
  },

  async getBySlug(slug) {
    return apiRequest(`/v1/advertisements/slug/${slug}`);
  },

  async create(advertisementData) {
    return apiRequest('/v1/advertisements', {
      method: 'POST',
      body: JSON.stringify(advertisementData),
    });
  },

  async update(id, advertisementData) {
    return apiRequest(`/v1/advertisements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(advertisementData),
    });
  },

  async delete(id) {
    return apiRequest(`/v1/advertisements/${id}`, {
      method: 'DELETE',
    });
  },
};

// Talents API
export const talentsApi = {
  async list(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/v1/talents${query ? `?${query}` : ''}`);
  },

  async getBySlug(slug) {
    return apiRequest(`/v1/talents/slug/${slug}`);
  },

  async create(talentData) {
    return apiRequest('/v1/talents', {
      method: 'POST',
      body: JSON.stringify(talentData),
    });
  },

  async update(id, talentData) {
    return apiRequest(`/v1/talents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(talentData),
    });
  },

  async delete(id) {
    return apiRequest(`/v1/talents/${id}`, {
      method: 'DELETE',
    });
  },
};

// File Upload API
export const uploadApi = {
  async uploadFile(dataUrl, folder = 'uploads') {
    return apiRequest('/v1/upload', {
      method: 'POST',
      body: JSON.stringify({ dataUrl, folder }),
    });
  },
};

// Health Check API
export const healthApi = {
  async check() {
    return apiRequest('/health');
  },
};

// Export all APIs
export const backendApi = {
  auth: authApi,
  articles: articlesApi,
  insights: insightsApi,
  podcasts: podcastsApi,
  events: eventsApi,
  training: trainingApi,
  newsletters: newslettersApi,
  categories: categoriesApi,
  upload: uploadApi,
  health: healthApi,
  advertisements: advertisementsApi,
  talents: talentsApi,
};

export default backendApi;
