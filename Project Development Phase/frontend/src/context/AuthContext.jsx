import React, { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Helper: read from localStorage first, then sessionStorage
function getStoredItem(key) {
  return localStorage.getItem(key) || sessionStorage.getItem(key) || null;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredItem("token"));
  const [user, setUser] = useState(() => {
    const savedUser = getStoredItem("user");
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const isAuthenticated = !!token;

  // rememberMe=true  → persist in localStorage (survives browser close)
  // rememberMe=false → store in sessionStorage (cleared on browser close)
  const login = useCallback((newToken, newUser, rememberMe = false) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("token", newToken);
    storage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  // Clear from both storages so no stale data remains
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  const updateProfileState = useCallback((updatedUser) => {
    // Write back to whichever storage is currently holding the token
    if (localStorage.getItem("token")) {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } else {
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
    }
    setUser(updatedUser);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout, updateProfileState }}>
      {children}
    </AuthContext.Provider>
  );
}
