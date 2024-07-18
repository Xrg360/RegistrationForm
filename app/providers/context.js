"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state based on localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if window is defined to safely access localStorage
    if (typeof window !== "undefined") {
      const isAuth = localStorage.getItem('isAuthenticated');
      return isAuth === 'true';
    }
    return false; // Default to false if window is not defined
  });

  const login = () => {
    if (typeof window !== "undefined") {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      setIsAuthenticated(false);
      localStorage.setItem('isAuthenticated', 'false');
    }
  };


  
  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(isAuth === 'true');
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);