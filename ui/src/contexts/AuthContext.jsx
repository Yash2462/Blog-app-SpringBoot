import { createContext, useContext, useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import api from '../api/axios'; // Adjust path to your axios instance

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoadingUser(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        // Check token expiration
        if (!decoded.exp || Date.now() >= decoded.exp * 1000) {
          localStorage.removeItem('token');
          setUser(null);
          setLoadingUser(false);
          return;
        }
        if (!decoded.email) {
          setUser(null);
          setLoadingUser(false);
          return;
        }

        // Fetch full user info by email
        const res = await api.get(`/api/users/getByMail?email=${encodeURIComponent(decoded.email)}`);

        if (res.data && res.data.data) {
          setUser(res.data.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, []);

  const login = async (token) => {
    localStorage.setItem('token', token);

    try {
      const decoded = jwtDecode(token);
      // Check token expiration
      if (!decoded.exp || Date.now() >= decoded.exp * 1000) {
        localStorage.removeItem('token');
        setUser(null);
        return;
      }
      if (!decoded.email) {
        setUser(null);
        return;
      }

      const res = await api.get(`/api/users/getByMail?email=${encodeURIComponent(decoded.email)}`);

      if (res.data && res.data.data) {
        setUser(res.data.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error during login user fetch:', error);
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loadingUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
