import { createContext, useContext, useState, useEffect } from "react";
import { loginCustomer, registerCustomer, getProfile, logoutCustomer } from "../services/authService";
import { isTokenExpired } from "../utils/token";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = localStorage.getItem("customer_token");

      if (!token || isTokenExpired(token)) {
        logoutCustomer();
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const profile = await getProfile();
        setUser(profile);
        localStorage.setItem("customer_user", JSON.stringify(profile));
      } catch {
        logoutCustomer();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  const login = async (credentials) => {
    const result = await loginCustomer(credentials);
    localStorage.setItem("customer_token", result.token);
    localStorage.setItem("customer_user", JSON.stringify(result.user));
    setUser(result.user);
    return result.user;
  };

  const register = async (data) => {
    const result = await registerCustomer(data);
    localStorage.setItem("customer_token", result.token);
    localStorage.setItem("customer_user", JSON.stringify(result.user));
    setUser(result.user);
    return result.user;
  };

  const logout = () => {
    logoutCustomer();
    setUser(null);
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem("customer_user", JSON.stringify(next));
      return next;
    });
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider.");
  return context;
}