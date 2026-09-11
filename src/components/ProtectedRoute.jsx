import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRole }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    if (allowedRole === 'inspector') {
      return <Navigate to="/inspector/login" state={{ from: location }} replace />;
    }
    if (allowedRole === 'manufacturer') {
      return <Navigate to="/manufacturer/login" state={{ from: location }} replace />;
    }
    if (allowedRole === 'consumer') {
      return <Navigate to="/consumer/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // If logged in with another role, redirect to their own portal or login
    if (user.role === 'inspector') return <Navigate to="/inspector/dashboard" replace />;
    if (user.role === 'manufacturer') return <Navigate to="/manufacturer/dashboard" replace />;
    if (user.role === 'consumer') return <Navigate to="/consumer/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}
