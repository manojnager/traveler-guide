import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageLoader from "../components/loader/PageLoader";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (!isAuthenticated || !isAdmin) return <Navigate to="/admin/login" replace />;

  return children;
}