import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import { SidebarProvider } from "../context/SidebarContext";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Destinations from "../pages/Destinations";
import CreateDestination from "../pages/CreateDestination";
import EditDestination from "../pages/EditDestination";
import AdminLayout from "../layouts/AdminLayout";

import "../styles/admin.css";

function AdminRoutes() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SidebarProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="destinations" element={<Destinations />} />
              <Route path="destinations/create" element={<CreateDestination />} />
              <Route path="destinations/:id/edit" element={<EditDestination />} />
            </Route>
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default AdminRoutes;