import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/config/axiosConfig';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get('/v1/auth/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUser(response.data.data.user);
    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axiosInstance.post('/v1/auth/login', { email, password });
      const { user: userData, tokens } = response.data.data;

      localStorage.setItem('token', tokens.access_token);
      localStorage.setItem('refreshToken', tokens.refresh_token);
      setUser(userData);

      if (!userData.email_verified) {
        navigate('/verify-email');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'An error occurred during login');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await axiosInstance.post('/v1/auth/register', userData);
      navigate('/verify-email');
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'An error occurred during registration');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
    navigate('/login');
  };

  const forgotPassword = async (email) => {
    try {
      setError(null);
      await axiosInstance.post('/v1/auth/forgot-password', { email });
    } catch (err) {
      setError(err.response?.data?.error?.message || 'An error occurred');
      throw err;
    }
  };

  const resetPassword = async (token, password) => {
    try {
      setError(null);
      await axiosInstance.post('/v1/auth/reset-password', { token, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'An error occurred');
      throw err;
    }
  };

  const verifyEmail = async (token) => {
    try {
      setError(null);
      await axiosInstance.post('/v1/auth/verify-email', { token });
      await fetchUser();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'An error occurred');
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
