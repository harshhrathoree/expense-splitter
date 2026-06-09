import { Routes, Route, Navigate } from "react-router-dom";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Groups from "@/pages/groups/Groups";
import GroupDetails from "@/pages/groups/GroupDetails";
import Dashboard from "@/pages/dashboard/Dashboard";
import LandingPage from "@/pages/landingpage/LandingPage";
import NotFound from "@/pages/notfound/NotFound";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import PublicRoute from "@/components/common/PublicRoute";
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      <Route
        path="/groups"
        element={
          <ProtectedRoute>
            <Groups />
          </ProtectedRoute>
        }
      />

      <Route
        path="/groups/:groupId"
        element={
          <ProtectedRoute>
            <GroupDetails />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
