import { useState } from "react";
import { Link } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import toast from "react-hot-toast";

import { forgotPassword } from "../services/authService";
import "./Auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setSubmitting(true);

    try {
      await forgotPassword(email);
      setSent(true);
    } catch {
      // Backend always returns success regardless of whether the email exists,
      // so an error here means something else went wrong (network, server)
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="container">
        <div className="auth-card">
          {sent ? (
            <div className="auth-success-box">
              <div className="auth-success-icon"><FaCheck /></div>
              <h1 style={{ fontSize: "24px", marginBottom: "12px" }}>Check Your Email</h1>
              <p style={{ color: "var(--text-light)", fontSize: "14px", marginBottom: "24px" }}>
                If an account exists for <strong>{email}</strong>, we've sent a password reset link.
                It will expire in 1 hour.
              </p>
              <Link to="/login" className="auth-footer-link" style={{ marginTop: 0 }}>
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="auth-card-header">
                <span>Account Recovery</span>
                <h1>Forgot Password?</h1>
                <p>Enter your email and we'll send you a link to reset your password.</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="auth-field">
                  <label>Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <button type="submit" className="auth-submit-btn" disabled={submitting}>
                  {submitting ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <div className="auth-footer-link">
                Remembered your password? <Link to="/login">Sign in</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default ForgotPassword;