import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On app load, restore user from localStorage
  useEffect(() => {
    const token = localStorage.getItem('olive_token');
    const stored = localStorage.getItem('olive_user');
    if (token && stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('olive_token', token);
    localStorage.setItem('olive_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('olive_token');
    localStorage.removeItem('olive_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
