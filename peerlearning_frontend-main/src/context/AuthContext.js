import React, { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, logout } from '../store/slices/authSlice';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const login = async (userData) => {
    try {
      dispatch(loginStart());
      // Here you would typically make an API call to authenticate
      // For now, we'll simulate success
      dispatch(loginSuccess({
        user: userData,
        token: 'dummy-token' // In a real app, this would be the actual token
      }));
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  };

  const logout = () => {
    dispatch(logout());
  };

  const switchRole = (newRole) => {
    dispatch(loginSuccess({
      user: { ...auth.user, role: newRole },
      token: auth.token
    }));
  };

  return (
    <AuthContext.Provider value={{
      user: auth.user,
      isAuthenticated: auth.isAuthenticated,
      login,
      logout,
      switchRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};
