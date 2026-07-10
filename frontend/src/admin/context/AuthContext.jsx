import { createContext, useContext, useState, useEffect } from "react";
import { loginAdmin, getProfile, logoutAdmin } from "../services/authService";
import { isTokenExpired } from "../utils/token";

const ADMIN_ROLE_ID = 1;
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token || isTokenExpired(token)) {
        logoutAdmin();
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const profile = await getProfile();
        setUser(profile);
        localStorage.setItem("admin_user", JSON.stringify(profile));
      } catch {
        logoutAdmin();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    bootstrapAuth();
  }, []);

  const login = async (credentials) => {
    const result = await loginAdmin(credentials);
    if (result.user.roleId !== ADMIN_ROLE_ID) {
      throw new Error("You are not authorized to access the admin panel.");
    }
    localStorage.setItem("admin_token", result.token);
    localStorage.setItem("admin_user", JSON.stringify(result.user));
    setUser(result.user);
    return result.user;
  };

  const logout = () => {
    logoutAdmin();
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.roleId === ADMIN_ROLE_ID,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider.");
  return context;
}