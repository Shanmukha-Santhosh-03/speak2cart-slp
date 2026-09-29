import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthService } from '../services/db';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = AuthService.getCurrentUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
