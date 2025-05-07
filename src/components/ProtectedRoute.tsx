import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectPath?: string;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectPath = '/login',
  adminOnly = false,
}) => {
  const { user, isLoading, profile } = useAuth();
  const location = useLocation();

  // Check for admin session in localStorage
  const checkAdminSession = () => {
    const userJson = localStorage.getItem('rideEasyUser');
    if (userJson) {
      try {
        const userData = JSON.parse(userJson);
        return userData.role === 'admin';
      } catch (error) {
        console.error("Error parsing admin user data:", error);
        return false;
      }
    }
    return false;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  // For admin routes
  if (adminOnly) {
    const isAdmin = checkAdminSession();
    if (!isAdmin) {
      return <Navigate to={redirectPath} state={{ from: location }} replace />;
    }
    return <>{children}</>;
  }

  // For regular user routes
  if (!user) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
