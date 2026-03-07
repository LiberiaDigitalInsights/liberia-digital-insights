"use client";

import React from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import { AuthProvider } from "@/context/AuthContext";
import { BookmarkProvider } from "@/context/BookmarkContext";

export function ClientProviders({ children }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BookmarkProvider>{children}</BookmarkProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
