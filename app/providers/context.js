"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== "undefined") {
      const isAuth = localStorage.getItem('isAuthenticated');
      return isAuth === 'true';
    }
    return false;
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
      localStorage.removeItem('userName');
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

export const useAuth = () => useContext(AuthContext);
