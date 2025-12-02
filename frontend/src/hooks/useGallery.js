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

export const useGallery = () => {
  return {
    // Get all gallery items
    getItems: async (params = {}) => {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });

      const response = await apiRequest(`/v1/gallery?${queryParams.toString()}`);
      return response; // Return the full response which includes items and pagination
    },

    // Get single gallery item
    getItem: async (id) => {
      const response = await apiRequest(`/v1/gallery/${id}`);
      return response;
    },

    // Get events with gallery items
    getEvents: async () => {
      const response = await apiRequest('/v1/gallery/events');
      return response;
    },

    // Get podcasts with gallery items
    getPodcasts: async () => {
      const response = await apiRequest('/v1/gallery/podcasts');
      return response;
    },

    // Get categories
    getCategories: async () => {
      const response = await apiRequest('/v1/gallery/categories');
      return response;
    },

    // Create gallery item
    createItem: async (itemData) => {
      const response = await apiRequest('/v1/gallery', {
        method: 'POST',
        body: JSON.stringify(itemData),
      });
      return response;
    },

    // Update gallery item
    updateItem: async (id, itemData) => {
      const response = await apiRequest(`/v1/gallery/${id}`, {
        method: 'PUT',
        body: JSON.stringify(itemData),
      });
      return response;
    },

    // Delete gallery item
    deleteItem: async (id) => {
      await apiRequest(`/v1/gallery/${id}`, {
        method: 'DELETE',
      });
    },
  };
};
