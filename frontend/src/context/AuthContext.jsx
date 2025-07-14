import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { loginUser as loginApiService, getMyProfile } from '../api/services';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('ziver_token'));
  const [loading, setLoading] = useState(true);

  // This function sets the auth token for API calls and local storage
  const setAuthToken = (token) => {
    if (token) {
      localStorage.setItem('ziver_token', token);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('ziver_token');
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
    setToken(token);
  };

  // This function fetches the user profile if a token exists
  const fetchUser = useCallback(async () => {
    if (token) {
      try {
        const profileData = await getMyProfile();
        setUser(profileData);
      } catch (error) {
        console.error("Session token is invalid. Logging out.", error);
        setAuthToken(null); // The token is bad, so clear it
      }
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (loginData) => {
    const response = await loginApiService(loginData);
    if (response.access_token) {
      setAuthToken(response.access_token);
      const profileData = await getMyProfile();
      setUser(profileData);
    }
    return response;
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
  };

  const value = { token, user, login, logout, isAuthenticated: !!token, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

