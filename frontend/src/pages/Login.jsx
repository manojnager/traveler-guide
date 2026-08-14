import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import "./Auth.css";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setSubmitting(true);

    try {
      await login(form);
      toast.success("Welcome back!");
      const redirectTo = location.state?.from || "/";
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || "Invalid email or password.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="container">
        <div className="auth-card">
          <div className="auth-card-header">
            <span>Welcome Back</span>
            <h1>Sign In</h1>
            <p>Sign in to manage your bookings and travel history.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label>Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>

            <div className="auth-field">
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required />
            </div>

            <Link to="/forgot-password" className="auth-forgot-link">Forgot password?</Link>

            <button type="submit" className="auth-submit-btn" disabled={submitting}>
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="auth-footer-link">
            Don't have an account? <Link to="/register">Create one</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;