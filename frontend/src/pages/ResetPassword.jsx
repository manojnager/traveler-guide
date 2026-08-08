import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import { resetPassword } from "../services/authService";
import "./Auth.css";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("This reset link is invalid.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      await resetPassword(token, password);
      toast.success("Password reset successfully! Please sign in.");
      navigate("/login", { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || "This reset link is invalid or has expired.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <main className="auth-page">
        <div className="container">
          <div className="auth-card">
            <div className="auth-card-header">
              <span>Invalid Link</span>
              <h1>Reset Link Missing</h1>
              <p>This password reset link is invalid or incomplete.</p>
            </div>
            <Link to="/forgot-password" className="auth-submit-btn" style={{ display: "block", textAlign: "center", textDecoration: "none", lineHeight: "54px" }}>
              Request a New Link
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="container">
        <div className="auth-card">
          <div className="auth-card-header">
            <span>Account Recovery</span>
            <h1>Set New Password</h1>
            <p>Choose a new password for your account.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label>New Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div className="auth-field">
              <label>Confirm New Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={submitting}>
              {submitting ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default ResetPassword;