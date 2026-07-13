import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import { getPublicDestinations } from "../services/destinationService";
import { mapDestination } from "../utils/destinationMapper";

import "./Booking.css";

function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const destinationId = searchParams.get("destinationId");

  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [guests, setGuests] = useState(
    Number(searchParams.get("guests")) || 2
  );
  const [travelDate, setTravelDate] = useState(
    searchParams.get("date") || ""
  );

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const loadDestination = async () => {
      if (!destinationId) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const data = await getPublicDestinations();
        const mapped = data.map(mapDestination);
        const match = mapped.find(
          (item) => item.id === Number(destinationId)
        );

        if (!match) {
          setNotFound(true);
        } else {
          setDestination(match);
        }
      } catch {
        toast.error("Failed to load destination.");
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadDestination();
  }, [destinationId]);

  const handleContinue = () => {
    if (!travelDate) {
      toast.error("Please select a travel date.");
      return;
    }

    const params = new URLSearchParams({
      destinationId,
      guests: String(guests),
      date: travelDate
    });

    navigate(`/checkout?${params.toString()}`);
  };

  if (loading) {
    return (
      <main className="booking-page">
        <div className="container" style={{ padding: "160px 0" }} />
      </main>
    );
  }

  if (notFound || !destination) {
    return (
      <main className="booking-page">
        <div className="container booking-empty">
          <h1>No destination selected</h1>
          <p>Please choose a destination before booking.</p>
          <Link to="/destinations" className="booking-btn">
            Browse Destinations
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="booking-page">
      <div className="container">

        <h1>Complete Your Booking</h1>
        <p className="booking-subtitle">
          Review your trip details before proceeding to checkout.
        </p>

        <div className="booking-layout">

          <div className="booking-summary-card">
            <img
              src={destination.image}
              alt={destination.title}
            />

            <div className="booking-summary-content">
              <span className="booking-summary-category">
                {destination.category}
              </span>

              <h2>{destination.title}</h2>

              <p className="booking-summary-location">
                {destination.location}
              </p>

              <p className="booking-summary-desc">
                {destination.shortDescription}
              </p>
            </div>
          </div>

          <div className="booking-form-card">

            <h3>Trip Details</h3>

            <div className="booking-field">
              <label>Travel Date</label>
              <input
                type="date"
                min={today}
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
              />
            </div>

            <div className="booking-field">
              <label>Guests</label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
              >
                {Array.from(
                  { length: destination.maxGuests || 8 },
                  (_, i) => i + 1
                ).map((item) => (
                  <option key={item} value={item}>
                    {item} Guest{item > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="booking-price-row">
              <span>Price per person</span>
              <strong>${destination.price}</strong>
            </div>

            <div className="booking-price-row">
              <span>Guests</span>
              <strong>× {guests}</strong>
            </div>

            <div className="booking-price-row booking-total-row">
              <span>Total</span>
              <strong>${destination.price * guests}</strong>
            </div>

            <button
              type="button"
              className="booking-btn"
              onClick={handleContinue}
            >
              Continue to Checkout
            </button>

          </div>

        </div>

      </div>
    </main>
  );
}

export default Booking;