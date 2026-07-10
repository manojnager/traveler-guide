import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: "", password: "" }
  });

  if (isAuthenticated) {
    const redirectTo = location.state?.from || "/admin";
    navigate(redirectTo, { replace: true });
    return null;
  }

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await login(data);
      toast.success("Login successful.");
      navigate("/admin", { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Login failed. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page page-center">
      <div className="container container-tight py-4">
        <div className="text-center mb-4">
          <h1 className="navbar-brand navbar-brand-autodark">Traveler Guide</h1>
          <div className="text-secondary">Admin Panel</div>
        </div>
        <form className="card card-md" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="card-body">
            <h2 className="h2 text-center mb-4">Sign in to your account</h2>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input type="email" className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="admin@example.com" autoComplete="username"
                {...register("email", {
                  required: "Email is required.",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address." }
                })} />
              {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className={`form-control ${errors.password ? "is-invalid" : ""}`}
                placeholder="Your password" autoComplete="current-password"
                {...register("password", {
                  required: "Password is required.",
                  minLength: { value: 6, message: "Password must be at least 6 characters." }
                })} />
              {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
            </div>
            <div className="form-footer">
              <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
                {submitting ? <ClipLoader color="#ffffff" size={18} /> : "Sign in"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}