import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/authContext.jsx";

function AccessGuard({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  // Define the routes that require complete information
  const routesRequiringInfo = ["/billing", "/profile", "/mybusiness", "/dashboard", "/next"];

  // Check if the user has the required information for the current route
  const infoComplete = routesRequiringInfo.includes(location.pathname)
    ? !!user.phone // For example, checking if the user has a phone number
    : true;

  // If the user does not have the required information, redirect to the previous page or to /next
  if (!infoComplete) {
    return <Navigate to="/next/step1" replace />;
  }

  // If the user has the information, allow access to the route
  return children;
}

export default AccessGuard;