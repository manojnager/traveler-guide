import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { FaUser, FaLock, FaSuitcaseRolling, FaCamera } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import { updateProfile, changePassword } from "../services/userService";
import { getMyBookings } from "../services/bookingService";
import { uploadAvatar } from "../services/avatarUploadService";
import { getImageUrl } from "../utils/image";

import "./Account.css";

const STATUS_BADGE = {
  PENDING: "status-pending",
  CONFIRMED: "status-confirmed",
  CANCELLED: "status-cancelled"
};

function ProfileTab() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || ""
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);

    try {
      const result = await uploadAvatar(file);
      const updated = await updateProfile({ avatar: result.path });
      updateUser(updated);
      toast.success("Profile photo updated.");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to upload photo.";
      toast.error(message);
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updated = await updateProfile(form);
      updateUser(updated);
      toast.success("Profile updated successfully.");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update profile.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="account-panel">
      <h3>Profile Information</h3>
      <p className="account-panel-sub">Update your name, phone number, and profile photo.</p>

      <div className="account-avatar-uploader">
        <div className="account-avatar-preview">
          {user?.avatar ? (
            <img src={getImageUrl(user.avatar)} alt={user.firstName} />
          ) : (
            <span>{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
          )}
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="d-none"
            style={{ display: "none" }}
            onChange={handleAvatarSelect}
          />
          <button
            type="button"
            className="account-avatar-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingAvatar}
          >
            <FaCamera />
            {uploadingAvatar ? "Uploading..." : "Change Photo"}
          </button>
          <p className="account-field-hint">JPG or PNG, square images look best.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="account-form-row">
          <div className="account-field">
            <label>First Name</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} required />
          </div>
          <div className="account-field">
            <label>Last Name</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} required />
          </div>
        </div>

        <div className="account-field">
          <label>Email Address</label>
          <input value={user?.email || ""} disabled />
          <span className="account-field-hint">Email address cannot be changed.</span>
        </div>

        <div className="account-field">
          <label>Phone Number</label>
          <input name="phone" value={form.phone} onChange={handleChange} />
        </div>

        <button type="submit" className="account-submit-btn" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

function PasswordTab() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setSaving(true);

    try {
      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });
      toast.success("Password updated successfully.");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update password.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="account-panel">
      <h3>Change Password</h3>
      <p className="account-panel-sub">Update the password used to sign in.</p>

      <form onSubmit={handleSubmit}>
        <div className="account-field">
          <label>Current Password</label>
          <input type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} required />
        </div>

        <div className="account-form-row">
          <div className="account-field">
            <label>New Password</label>
            <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} required />
          </div>
          <div className="account-field">
            <label>Confirm New Password</label>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
          </div>
        </div>

        <button type="submit" className="account-submit-btn" disabled={saving}>
          {saving ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}

function BookingsTab() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await getMyBookings({ limit: 50 });
        setBookings(data.items);
      } catch {
        toast.error("Failed to load your bookings.");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  if (loading) {
    return <div className="account-panel"><p className="account-panel-sub">Loading your bookings...</p></div>;
  }

  return (
    <div className="account-panel">
      <h3>My Bookings</h3>
      <p className="account-panel-sub">A history of all your trips booked with us.</p>

      {bookings.length === 0 ? (
        <div className="account-empty-state">
          <FaSuitcaseRolling />
          <p>You haven't made any bookings yet.</p>
          <Link to="/destinations" className="account-submit-btn account-empty-link">Browse Destinations</Link>
        </div>
      ) : (
        <div className="account-bookings-list">
          {bookings.map((booking) => (
            <div className="account-booking-card" key={booking.id}>
              <img
                src={getImageUrl(booking.destination?.thumbnail)}
                alt={booking.destination?.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/200x200/162235/B6C2D2?text=No+Image";
                }}
              />

              <div className="account-booking-info">
                <div className="account-booking-top">
                  <h4>{booking.destination?.title}</h4>
                  <span className={`account-status-badge ${STATUS_BADGE[booking.status]}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="account-booking-meta">
                  <span>Booking #{booking.id}</span>
                  <span>{format(new Date(booking.travelDate), "MMM dd, yyyy")}</span>
                  <span>{booking.guests} Guest{booking.guests > 1 ? "s" : ""}</span>
                  <span>${Number(booking.totalAmount).toFixed(2)}</span>
                </div>

                {booking.destination?.slug && (
                  <Link to={`/destinations/${booking.destination.slug}`} className="account-booking-link">
                    View Destination →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Account() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const TABS = [
    { key: "profile", label: "Profile", icon: <FaUser /> },
    { key: "bookings", label: "My Bookings", icon: <FaSuitcaseRolling /> },
    { key: "password", label: "Password", icon: <FaLock /> }
  ];

  return (
    <main className="account-page">
      <div className="container">
        <div className="account-header">
          <div className="account-avatar">
            {user?.avatar ? (
              <img src={getImageUrl(user.avatar)} alt={user.firstName} />
            ) : (
              <span>{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
            )}
          </div>
          <div>
            <h1>{user?.firstName} {user?.lastName}</h1>
            <p>{user?.email}</p>
          </div>
        </div>

        <div className="account-layout">
          <aside className="account-sidebar">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`account-tab ${activeTab === tab.key ? "is-active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </aside>

          <div className="account-content">
            {activeTab === "profile" && <ProfileTab />}
            {activeTab === "bookings" && <BookingsTab />}
            {activeTab === "password" && <PasswordTab />}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Account;