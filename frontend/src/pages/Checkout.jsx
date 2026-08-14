import { useEffect, useState } from "react";

import { useSearchParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { getPublicDestinations } from "../services/destinationService";
import { mapDestination } from "../utils/destinationMapper";
import { createBooking } from "../services/bookingService";
import { getStripeConfig, createPaymentIntent, confirmPayment } from "../services/paymentService";
import { useAuth } from "../context/AuthContext";
import StripeCardForm from "../components/StripeCardForm/StripeCardForm";
import { useSettings } from "../context/SettingsContext";
import { formatPrice } from "../utils/currency";


import "./Checkout.css";

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const destinationId = searchParams.get("destinationId");
  const travelDate = searchParams.get("date");
  const guests = Number(searchParams.get("guests")) || 0;

  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const [stripePromise, setStripePromise] = useState(null);
  const [stripeEnabled, setStripeEnabled] = useState(false);
  const [showCardStep, setShowCardStep] = useState(false);
  const [pendingBooking, setPendingBooking] = useState(null);
  const { settings } = useSettings();
  const cancellationPolicy = destination?.cancellationPolicy || settings.default_cancellation_policy;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    paymentMethod: "Credit Card"
  });

  // Load Stripe publishable key + enabled flag
  useEffect(() => {
    const loadStripeConfig = async () => {
      try {
        const config = await getStripeConfig();
        if (config.enabled && config.publishableKey) {
          setStripeEnabled(true);
          setStripePromise(loadStripe(config.publishableKey));
        }
      } catch {
        setStripeEnabled(false);
      }
    };

    loadStripeConfig();
  }, []);

  // Prefill the form with the logged-in user's details
  useEffect(() => {
    if (isAuthenticated && user) {
      setForm((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || ""
      }));
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!destinationId || !travelDate || !guests) {
      navigate("/destinations", { replace: true });
      return;
    }

    const loadDestination = async () => {
      try {
        const data = await getPublicDestinations();
        const mapped = data.map(mapDestination);
        const match = mapped.find((item) => item.id === Number(destinationId));

        if (!match) {
          toast.error("Destination not found.");
          navigate("/destinations", { replace: true });
          return;
        }

        setDestination(match);
      } catch {
        toast.error("Could not load destination details.");
        navigate("/destinations", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadDestination();
  }, [destinationId, travelDate, guests, navigate]);

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
      const response = await createBooking({
        destinationId: destination.id,
        travelDate,
        guests,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        paymentMethod: form.paymentMethod
      });

      const booking = response.booking;

      if (form.paymentMethod === "Credit Card" && stripeEnabled) {
        // Booking is created (status PENDING). Move to the card payment step
        // instead of showing the confirmation screen immediately.
        setPendingBooking(booking);
        setShowCardStep(true);
      } else {
        // PayPal / Bank Transfer, or Stripe not configured — unchanged behavior
        setConfirmedBooking(booking);
        setPaymentStatus("PENDING");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to complete booking.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStripePay = async (stripe, elements) => {
    const { clientSecret } = await createPaymentIntent(pendingBooking.id);

    const cardElement = elements.getElement("card");

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          phone: form.phone || undefined,
          address: {
            line1: form.addressLine1 || undefined,
            city: form.city || undefined,
            state: form.state || undefined,
            postal_code: form.postalCode || undefined,
            country: form.country || undefined
          }
        }
      }
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    if (result.paymentIntent.status === "succeeded") {
      await confirmPayment(pendingBooking.id, result.paymentIntent.id);
      setConfirmedBooking(pendingBooking);
      setPaymentStatus("PAID");
      toast.success("Payment successful!");
    } else {
      throw new Error("Payment could not be completed.");
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
                <strong>{formatPrice(destination.price * guests, settings.currency)}</strong>
              </div>
              <div className="checkout-confirmation-row">
                <span>Status</span>
                <strong>{paymentStatus === "PAID" ? "Paid" : "Pending Confirmation"}</strong>
              </div>
            </div>

            {isAuthenticated ? (
              <Link to="/account" className="checkout-confirmation-btn">
                View My Bookings
              </Link>
            ) : (
              <Link to="/destinations" className="checkout-confirmation-btn">
                Explore More Destinations
              </Link>
            )}
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
            <h3>{showCardStep ? "Payment Details" : "Contact Details"}</h3>

            {!showCardStep && isAuthenticated && (
              <p className="checkout-logged-in-note">
                Booking as <strong>{user?.email}</strong>. This booking will be linked to your account.
              </p>
            )}

            {showCardStep ? (
              stripePromise && (
                <Elements stripe={stripePromise}>
                  <StripeCardForm
                    amount={formatPrice(destination.price * guests, settings.currency)}
                    onPaySuccess={handleStripePay}
                    onBack={() => setShowCardStep(false)}
                  />
                </Elements>
              )
            ) : (
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
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={isAuthenticated}
                    required
                  />
                  {isAuthenticated && (
                    <span className="checkout-field-hint">
                      Locked to your account email. Not you? <Link to="/login">Switch account</Link>
                    </span>
                  )}
                </div>

                <div className="checkout-field">
                  <label>Phone Number</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} />
                </div>

                <div className="checkout-field">
                  <label>Billing Address</label>
                  <input
                    name="addressLine1"
                    placeholder="Street address"
                    value={form.addressLine1}
                    onChange={handleChange}
                  />
                </div>

                <div className="checkout-form-row">
                  <div className="checkout-field">
                    <label>City</label>
                    <input name="city" value={form.city} onChange={handleChange} />
                  </div>
                  <div className="checkout-field">
                    <label>State / Province</label>
                    <input name="state" value={form.state} onChange={handleChange} />
                  </div>
                </div>

                <div className="checkout-form-row">
                  <div className="checkout-field">
                    <label>Postal Code</label>
                    <input name="postalCode" value={form.postalCode} onChange={handleChange} />
                  </div>
                  <div className="checkout-field">
                    <label>Country</label>
                    <select name="country" value={form.country} onChange={handleChange}>
                      <option value="">Select country</option>
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                      <option value="IN">India</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="AE">United Arab Emirates</option>
                      <option value="SG">Singapore</option>
                      <option value="JP">Japan</option>
                    </select>
                  </div>
                </div>

                <div className="checkout-field">
                  <label>Payment Method</label>
                  <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
                    {stripeEnabled && <option>Credit Card</option>}
                    <option>PayPal</option>
                    <option>Bank Transfer</option>
                  </select>
                  <p className="checkout-payment-note">
                    {form.paymentMethod === "Credit Card" && stripeEnabled
                      ? "You'll enter your card details on the next step."
                      : "This is a demo option — no real payment is processed. Your booking will be marked pending until confirmed by our team."}
                  </p>
                </div>

                <button type="submit" className="checkout-submit-btn" disabled={submitting}>
                  {submitting ? "Processing..." : form.paymentMethod === "Credit Card" && stripeEnabled ? "Continue to Payment" : "Confirm & Book"}
                </button>
              </form>
            )}
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
                <strong>{formatPrice(destination.price, settings.currency)}</strong>
              </div>

              <div className="checkout-summary-total">
                <span>Total</span>
                <strong>{formatPrice(destination.price * guests, settings.currency)}</strong>
              </div>

              {cancellationPolicy && (
                <div className="checkout-cancellation-note">
                  <strong>Cancellation Policy</strong>
                  <p>{cancellationPolicy}</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}