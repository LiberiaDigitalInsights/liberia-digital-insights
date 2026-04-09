"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "@/hooks/useBackendApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifySession = async () => {
      const token = authApi.getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authApi.verify(token);
        if (response.user) {
          setUser(response.user);
        } else {
          authApi.clearToken();
        }
      } catch (err) {
        console.error("Session verification failed:", err);
        authApi.clearToken();
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.login(credentials);
      authApi.setToken(response.token);
      setUser(response.user);
      return response.user;
    } catch (err) {
      const msg = err.message || "Login failed";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.register(userData);
      return response;
    } catch (err) {
      const msg = err.message || "Registration failed";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authApi.clearToken();
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
