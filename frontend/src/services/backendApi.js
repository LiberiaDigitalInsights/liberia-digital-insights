// Backend API service for Liberia Digital Insights
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    // Handle both error formats: {error: "message"} and {message: "message"}
    const errorMessage = error.error || error.message || `HTTP error! status: ${response.status}`;
    throw new Error(errorMessage);
  }

  // Handle 204 No Content responses (common for delete operations)
  if (response.status === 204) {
    return null;
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

  async getById(id) {
    console.log('API: Fetching training by ID:', id);
    const result = await apiRequest(`/v1/training/${id}`);
    console.log('API: Training response:', result);
    return result;
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

  // Send newsletter to recipients
  async send(id, recipientData) {
    return apiRequest(`/v1/newsletters/${id}/send`, {
      method: 'POST',
      body: JSON.stringify(recipientData),
    });
  },

  // Get newsletter templates
  async getTemplates() {
    return apiRequest('/v1/newsletters/templates');
  },

  // Create custom template
  async createTemplate(templateData) {
    return apiRequest('/v1/newsletters/templates', {
      method: 'POST',
      body: JSON.stringify(templateData),
    });
  },

  // Get subscribers
  async getSubscribers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/v1/newsletters/subscribers${query ? `?${query}` : ''}`);
  },

  // Add subscribers
  async addSubscribers(subscribers) {
    return apiRequest('/v1/newsletters/subscribers', {
      method: 'POST',
      body: JSON.stringify(subscribers),
    });
  },

  // Get newsletter statistics
  async getStats(id) {
    return apiRequest(`/v1/newsletters/${id}/stats`);
  },

  // Get newsletter replies/conversations
  async getReplies(newsletterId) {
    return apiRequest(`/v1/newsletters/${newsletterId}/replies`);
  },

  // Reply to subscriber
  async replyToSubscriber(newsletterId, replyData) {
    return apiRequest(`/v1/newsletters/${newsletterId}/replies`, {
      method: 'POST',
      body: JSON.stringify(replyData),
    });
  },

  // Preview newsletter
  async preview(id, recipientData) {
    return apiRequest(`/v1/newsletters/${id}/preview`, {
      method: 'POST',
      body: JSON.stringify(recipientData),
    });
  },

  // Subscribe to newsletter
  async subscribe(subscriberData) {
    return apiRequest('/v1/newsletters/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscriberData),
    });
  },

  // Unsubscribe from newsletter
  async unsubscribe(token) {
    return apiRequest('/v1/newsletters/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },

  // Get subscribers list
  async getSubscribersList(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/v1/newsletters/subscribers${query ? `?${query}` : ''}`);
  },

  // Delete subscriber
  async deleteSubscriber(id) {
    return apiRequest(`/v1/newsletters/subscribers/${id}`, {
      method: 'DELETE',
    });
  },

  // Update subscriber status
  async updateSubscriberStatus(id, status) {
    return apiRequest(`/v1/newsletters/subscribers/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Get newsletter analytics
  async getAnalytics() {
    return apiRequest('/v1/newsletters/analytics');
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

// Analytics API
export const analyticsApi = {
  // Get daily traffic stats
  async getTraffic(days = 30) {
    return apiRequest(`/v1/analytics/traffic?days=${days}`);
  },

  // Get aggregated stats
  async getStats() {
    return apiRequest('/v1/analytics/stats');
  },

  // Get recent activity
  async getRecentActivity() {
    return apiRequest('/v1/analytics/activity');
  },

  // Track a visit
  async trackVisit(isNewVisit = false) {
    return apiRequest('/v1/analytics/track', {
      method: 'POST',
      body: JSON.stringify({ isNewVisit }),
    });
  },
};

// Users Management API (Admin only)
export const usersApi = {
  async list() {
    return apiRequest('/v1/users');
  },

  async create(userData) {
    return apiRequest('/v1/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async updateRole(id, role) {
    return apiRequest(`/v1/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  },

  async updateStatus(id, is_active) {
    return apiRequest(`/v1/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active }),
    });
  },

  async delete(id) {
    return apiRequest(`/v1/users/${id}`, {
      method: 'DELETE',
    });
  },

  async changePassword(currentPassword, newPassword) {
    return apiRequest('/v1/users/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
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
  analytics: analyticsApi,
  users: usersApi,
};

export default backendApi;
