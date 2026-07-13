import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import { getPublicDestinationBySlug } from "../services/destinationService";
import { mapDestination } from "../utils/destinationMapper";
import { createBooking } from "../services/bookingService";
import { getImageUrl } from "../utils/image";
import "./Checkout.css";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const { slug, travelDate, guests } = location.state || {};

  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    paymentMethod: "Credit Card"
  });

  useEffect(() => {
    if (!slug || !travelDate || !guests) {
      navigate("/destinations", { replace: true });
      return;
    }

    const loadDestination = async () => {
      try {
        const data = await getPublicDestinationBySlug(slug);
        setDestination(mapDestination(data));
      } catch {
        toast.error("Could not load destination details.");
        navigate("/destinations", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadDestination();
  }, [slug, travelDate, guests, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.firstName || !form.lastName || !form.email) {
      toast.error("Please fill in your name and email.");
      return;
    }

    setSubmitting(true);

    try {
      const booking = await createBooking({
        destinationId: destination.id,
        travelDate,
        guests,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        paymentMethod: form.paymentMethod
      });

      setConfirmedBooking(booking);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to complete booking.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="checkout-loading">Loading checkout...</div>;
  }

  if (confirmedBooking) {
    return (
      <section className="checkout-section">
        <div className="container">
          <div className="checkout-confirmation-card">
            <span className="checkout-confirmation-badge">Booking Confirmed</span>
            <h1>Thank You, {form.firstName}!</h1>
            <p className="checkout-confirmation-sub">
              Your journey to {destination.title} is booked. A confirmation has been sent to {form.email}.
            </p>

            <div className="checkout-confirmation-details">
              <div className="checkout-confirmation-row">
                <span>Booking Reference</span>
                <strong>#{confirmedBooking.id}</strong>
              </div>
              <div className="checkout-confirmation-row">
                <span>Destination</span>
                <strong>{destination.title}</strong>
              </div>
              <div className="checkout-confirmation-row">
                <span>Travel Date</span>
                <strong>{travelDate}</strong>
              </div>
              <div className="checkout-confirmation-row">
                <span>Guests</span>
                <strong>{guests}</strong>
              </div>
              <div className="checkout-confirmation-row">
                <span>Total Paid</span>
                <strong>${(destination.price * guests).toFixed(2)}</strong>
              </div>
              <div className="checkout-confirmation-row">
                <span>Status</span>
                <strong>Pending Confirmation</strong>
              </div>
            </div>

            <Link to="/destinations" className="checkout-confirmation-btn">
              Explore More Destinations
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-section">
      <div className="container">
        <div className="section-title" style={{ textAlign: "left", marginBottom: "50px" }}>
          <span>Secure Checkout</span>
          <h2>Complete Your Booking</h2>
        </div>

        <div className="details-layout">
          <div className="checkout-form-card">
            <h3>Contact Details</h3>

            <form onSubmit={handleSubmit}>
              <div className="checkout-form-row">
                <div className="checkout-field">
                  <label>First Name</label>
                  <input name="firstName" value={form.firstName} onChange={handleChange} required />
                </div>
                <div className="checkout-field">
                  <label>Last Name</label>
                  <input name="lastName" value={form.lastName} onChange={handleChange} required />
                </div>
              </div>

              <div className="checkout-field">
                <label>Email Address</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </div>

              <div className="checkout-field">
                <label>Phone Number</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} />
              </div>

              <div className="checkout-field">
                <label>Payment Method</label>
                <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
                  <option>Credit Card</option>
                  <option>PayPal</option>
                  <option>Bank Transfer</option>
                </select>
                <p className="checkout-payment-note">
                  This is a demo checkout — no real payment is processed. Your booking will be marked pending until confirmed by our team.
                </p>
              </div>

              <button type="submit" className="checkout-submit-btn" disabled={submitting}>
                {submitting ? "Processing..." : "Confirm & Book"}
              </button>
            </form>
          </div>

          <aside className="checkout-summary-card">
            <img
              src={destination.image}
              alt={destination.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/600x400/162235/B6C2D2?text=No+Image";
              }}
            />

            <div className="checkout-summary-body">
              <h4>{destination.title}</h4>
              <p className="checkout-summary-location">{destination.location}</p>

              <div className="checkout-summary-row">
                <span>Travel Date</span>
                <strong>{travelDate}</strong>
              </div>
              <div className="checkout-summary-row">
                <span>Guests</span>
                <strong>{guests}</strong>
              </div>
              <div className="checkout-summary-row">
                <span>Price / Guest</span>
                <strong>${destination.price}</strong>
              </div>

              <div className="checkout-summary-total">
                <span>Total</span>
                <strong>${(destination.price * guests).toFixed(2)}</strong>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default Checkout;