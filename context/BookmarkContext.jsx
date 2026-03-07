"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  useAuth,
  useBookmarks as useBookmarksApi,
} from "@/hooks/useBackendApi";

const BookmarkContext = createContext();

export function BookmarkProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use the existing hook but control its execution
  const {
    data,
    loading: apiLoading,
    error: apiError,
    refetch,
  } = useBookmarksApi({}, { immediate: isAuthenticated });

  useEffect(() => {
    if (data?.bookmarks) {
      setBookmarks(data.bookmarks);
    }
  }, [data]);

  useEffect(() => {
    if (apiError) {
      setError(apiError);
    }
  }, [apiError]);

  const isBookmarked = useCallback(
    (contentId, contentType) => {
      return bookmarks.some(
        (b) => b.content_id === contentId && b.content_type === contentType,
      );
    },
    [bookmarks],
  );

  const getBookmarkId = useCallback(
    (contentId, contentType) => {
      const found = bookmarks.find(
        (b) => b.content_id === contentId && b.content_type === contentType,
      );
      return found?.id || null;
    },
    [bookmarks],
  );

  const refresh = useCallback(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated, refetch]);

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        loading: apiLoading,
        error,
        isBookmarked,
        getBookmarkId,
        refresh,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export const useBookmarkContext = () => {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error(
      "useBookmarkContext must be used within a BookmarkProvider",
    );
  }
  return context;
};
