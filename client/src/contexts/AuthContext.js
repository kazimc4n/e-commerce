import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: true,
  isAuthenticated: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGIN_FAIL':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'LOAD_USER_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOAD_USER_FAIL':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on mount
  useEffect(() => {
    if (state.token) {
      loadUser();
    } else {
      dispatch({ type: 'LOAD_USER_FAIL' });
    }
  }, []);

  // Load user from token
  const loadUser = async () => {
    try {
      const response = await api.get('/auth/me');
      dispatch({
        type: 'LOAD_USER_SUCCESS',
        payload: response.data.data.user,
      });
    } catch (error) {
      dispatch({ type: 'LOAD_USER_FAIL' });
      localStorage.removeItem('token');
    }
  };

  // Login
  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data.data;
      
      localStorage.setItem('token', token);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { token, user },
      });
      
      return { success: true };
    } catch (error) {
      dispatch({ type: 'LOGIN_FAIL' });
      return {
        success: false,
        error: error.response?.data?.error || 'Giriş yapılırken bir hata oluştu',
      };
    }
  };

  // Register
  const register = async (userData) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data.data;
      
      localStorage.setItem('token', token);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { token, user },
      });
      
      return { success: true };
    } catch (error) {
      dispatch({ type: 'LOGIN_FAIL' });
      return {
        success: false,
        error: error.response?.data?.error || 'Kayıt olurken bir hata oluştu',
      };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData);
      dispatch({
        type: 'UPDATE_USER',
        payload: response.data.data.user,
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Profil güncellenirken bir hata oluştu',
      };
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      await api.put('/auth/password', { currentPassword, newPassword });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Şifre değiştirilirken bir hata oluştu',
      };
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 