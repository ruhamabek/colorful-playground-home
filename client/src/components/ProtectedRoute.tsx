import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authClient } from "@/lib/auth-client";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireComplete?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireComplete = false,
}) => {
  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to sign-in
  if (!session) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // // If we require a complete profile and the user's profile is not complete
  // if (requireComplete && user && !user.isComplete) {
  //   return <Navigate to="/profile-setup" replace />;
  // }

  // Otherwise, render children
  return <>{children}</>;
};

export default ProtectedRoute;
