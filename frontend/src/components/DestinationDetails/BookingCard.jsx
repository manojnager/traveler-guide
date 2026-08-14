import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaCalendarAlt,
  FaGlobeAsia,
  FaShieldAlt,
  FaStar,
  FaUserFriends,
  FaHeart,
  FaRegHeart
} from "react-icons/fa";

import { isWishlisted, toggleWishlist } from "../../utils/wishlist";
import BookingCalendar from "./BookingCalendar";

import { useSettings } from "../../context/SettingsContext";
import { formatPrice } from "../../utils/currency";

import "./BookingCard.css";

function BookingCard({ destination }) {
  const navigate = useNavigate();

  const [guests, setGuests] = useState(2);
  const [travelDate, setTravelDate] = useState("");
  const [saved, setSaved] = useState(isWishlisted(destination.slug));

  const handleReserve = () => {
    if (!travelDate) {
      toast.error("Please select a travel date.");
      return;
    }

    const params = new URLSearchParams({
      destinationId: destination.id,
      guests: String(guests),
      date: travelDate
    });

    navigate(`/booking?${params.toString()}`);
  };

  const handleWishlistToggle = () => {
    const nowSaved = toggleWishlist(destination.slug);
    setSaved(nowSaved);
    toast.success(
      nowSaved ? "Added to your wishlist." : "Removed from wishlist."
    );
  };
  const { settings } = useSettings();

  return (
    <aside className="booking-card">

      <span className="booking-label">
        Starting From
      </span>

      <h2>{formatPrice(destination.price, settings.currency)}</h2>

      <span className="booking-person">
        Per Person
      </span>

      <div className="booking-rating">
        <FaStar />

        <span>
          {destination.rating} / 5 Rating
        </span>
      </div>

      <div className="booking-fields">

        <div className="booking-field">
          <label>Travel Date</label>
          <BookingCalendar
            destinationId={destination.id}
            value={travelDate}
            onChange={setTravelDate}
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
              <option
                key={item}
                value={item}
              >
                {item} Guest{item > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

      </div>

      <ul>

        <li>
          <FaCalendarAlt />
          <span>{destination.duration}</span>
        </li>

        <li>
          <FaGlobeAsia />
          <span>{destination.country}</span>
        </li>

        <li>
          <FaUserFriends />
          <span>{guests} Guest{guests > 1 ? "s" : ""}</span>
        </li>

        <li>
          <FaShieldAlt />
          <span>Free Cancellation</span>
        </li>

      </ul>

      <div className="booking-total">

        <span>Total</span>

        <strong>
          {formatPrice(destination.price * guests, settings.currency)}
        </strong>

      </div>

      <button
        className="booking-btn"
        type="button"
        onClick={handleReserve}
      >
        Reserve Your Journey
      </button>

      <button
        className="wishlist-outline"
        type="button"
        onClick={handleWishlistToggle}
      >
        {saved ? <FaHeart /> : <FaRegHeart />}{" "}
        {saved ? "Saved to Wishlist" : "Save to Wishlist"}
      </button>

    </aside>
  );
}

export default BookingCard;