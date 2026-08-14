import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import "./Auth.css";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);

    try {
      await register(form);
      toast.success("Account created! Welcome to TravelerGuide.");
      navigate("/", { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create account.";
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
            <span>Join Us</span>
            <h1>Create Account</h1>
            <p>Create an account to track your bookings and save destinations.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="auth-row">
              <div className="auth-field">
                <label>First Name</label>
                <input name="firstName" value={form.firstName} onChange={handleChange} required />
              </div>
              <div className="auth-field">
                <label>Last Name</label>
                <input name="lastName" value={form.lastName} onChange={handleChange} required />
              </div>
            </div>

            <div className="auth-field">
              <label>Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>

            <div className="auth-field">
              <label>Phone Number</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} />
            </div>

            <div className="auth-field">
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={submitting}>
              {submitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="auth-footer-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Register;