"use client";

import { useApi } from "./useBackendApi";

export const useGallery = () => {
  return {
    getItems: async () => ({
      items: [
        {
          id: 1,
          type: "image",
          title: "Tech Summit Recap",
          url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
          category: "Events",
        },
        {
          id: 2,
          type: "video",
          title: "Digital Liberia Interview",
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          thumbnail_url:
            "https://images.unsplash.com/photo-1478737270239-2fccd27ee086?w=400&q=80",
          category: "Interviews",
        },
      ],
    }),
    getEvents: async () => [
      { id: 1, title: "Summit 2024", slug: "summit-2024" },
      { id: 2, title: "Workshop", slug: "workshop" },
    ],
    getCategories: async () => ["Events", "Interviews", "Podcasts"],
  };
};

export const useGalleryItems = (params = {}) => {
  return useApi(async () => [], [JSON.stringify(params)]);
};
