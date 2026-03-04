"use client";

import { useMemo } from "react";
import { apiRequest, useApi } from "./useBackendApi";

export const useGallery = () => {
  return useMemo(
    () => ({
      getItems: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return apiRequest(`/gallery${query ? `?${query}` : ""}`);
      },
      getEvents: async () => apiRequest("/gallery/events"),
      getCategories: async () => apiRequest("/gallery/categories"),
    }),
    [],
  );
};

export const useGalleryItems = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return useApi(
    () => apiRequest(`/gallery${query ? `?${query}` : ""}`),
    [query],
  );
};
