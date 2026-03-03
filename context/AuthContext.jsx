"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
// We'll update this import once backendApi is ported or shimmed
// import { backendApi } from '../services/backendApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem("ldi_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Placeholder for real verification
        // const response = await backendApi.auth.verify(token);
        // if (response.valid) {
        //   setUser(response.user);
        // } else {
        //   localStorage.removeItem('ldi_token');
        // }
        setLoading(false);
      } catch (err) {
        console.error("Session verification failed:", err);
        localStorage.removeItem("ldi_token");
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      // Placeholder for real login
      // const response = await backendApi.auth.login({ email, password });
      // localStorage.setItem('ldi_token', response.token);
      // setUser(response.user);
      // return response.user;
    } catch (err) {
      const msg = err.message || "Login failed";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("ldi_token");
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
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
