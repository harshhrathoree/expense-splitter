import { Routes, Route } from "react-router-dom";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Groups from "@/pages/groups/Groups";
import GroupDetails from "@/pages/groups/GroupDetails";
import ProtectedRoute
from "@/components/common/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

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
    </Routes>
  );
}

export default AppRoutes;
