import React from 'react';
import { Navigate } from 'react-router';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') ? true : false;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

export default PrivateRoute;