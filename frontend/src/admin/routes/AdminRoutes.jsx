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
import Categories from "../pages/Categories";
import Countries from "../pages/Countries";
import Cities from "../pages/Cities";
import Amenities from "../pages/Amenities";
import Bookings from "../pages/Bookings";
import Users from "../pages/Users";
import Reviews from "../pages/Reviews";
import Wishlist from "../pages/Wishlist";
import Settings from "../pages/Settings";

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
              <Route path="categories" element={<Categories />} />
              <Route path="countries" element={<Countries />} />
              <Route path="cities" element={<Cities />} />
              <Route path="amenities" element={<Amenities />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="users" element={<Users />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default AdminRoutes;