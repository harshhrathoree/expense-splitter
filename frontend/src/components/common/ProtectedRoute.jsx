import { Navigate } from "react-router-dom";

import useAuth from "@/hooks/useAuth";

function ProtectedRoute({
  children,
}) {
  const {
    accessToken,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  if (!accessToken) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;