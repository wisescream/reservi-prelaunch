import React from "react";
import { Navigate } from "react-router-dom";
import { useAdmin } from "../../../lib/AdminContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

/**
 * Protected route that checks authentication and optionally admin role
 */
export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAdmin();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="animate-spin">
          <div className="h-8 w-8 border-4 border-gray-300 border-t-black rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

/**
 * Admin route - requires both authentication and admin role
 */
export function AdminRoute({ children }: ProtectedRouteProps) {
  return <ProtectedRoute requireAdmin={true}>{children}</ProtectedRoute>;
}
