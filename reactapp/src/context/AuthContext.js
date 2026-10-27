import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    if (email) {
      setUser({ email, role: role || 'GUEST', name: name || 'Guest User' });
    }
  }, []);

  const login = async (email, password, adminKey = null) => {
    const res = await authAPI.login({ email, password, adminKey });
    const { token, role } = res.data;
    const name = email.split('@')[0];

    if (token) localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    localStorage.setItem('role', role);
    localStorage.setItem('name', name);

    setUser({ email, role, name });
    return res.data;
  };

  const register = async (userData) => {
    const res = await authAPI.register(userData);
    const role = res.data?.role || userData.role || 'GUEST';
    const token = res.data?.token;

    if (token) localStorage.setItem('token', token);
    localStorage.setItem('email', userData.email);
    localStorage.setItem('role', role);
    localStorage.setItem('name', userData.name);

    setUser({ email: userData.email, role, name: userData.name });
    return res.data;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
