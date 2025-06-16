import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Session } from "@supabase/supabase-js";

interface AuthRouterProps {
  session: Session | null;
}

// Protected route - redirects to /event-id if not authenticated
export const ProtectedRoute = ({ session }: AuthRouterProps) => {
  const location = useLocation();

  if (!session) {
    // Redirect to the event ID page, but save where they were trying to go
    return <Navigate to="/eventId" state={{ from: location }}  />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

// Public route - redirects to / if already authenticated
export const PublicRoute = ({ session }: AuthRouterProps) => {
  if (session) {
    // If user is already signed in, redirect to player home
    //return <Navigate to="/"  />;
  }

  // If not authenticated, render the child routes
  return <Outlet />;
};
