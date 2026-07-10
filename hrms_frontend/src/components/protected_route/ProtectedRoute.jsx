import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtecF = ({ children, modulePath }) => {
  const { token, permissions } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

 
  const hasAccess = permissions.some((item) => item.path === modulePath);


  if (!hasAccess) {
    return <Navigate to="/not-authorized" replace />;
  }

 
  return children;
};
