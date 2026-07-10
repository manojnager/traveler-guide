import { useState } from "react";
import {
  FaCalendarAlt,
  FaGlobeAsia,
  FaShieldAlt,
  FaStar,
  FaUserFriends
} from "react-icons/fa";

import "./BookingCard.css";

function BookingCard({ destination }) {
  const [guests, setGuests] = useState(2);

  return (
    <aside className="booking-card">

      <span className="booking-label">
        Starting From
      </span>

      <h2>${destination.price}</h2>

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

          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        <div className="booking-field">
          <label>Guests</label>

          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
          >
            {[1,2,3,4,5,6,7,8].map((item)=>(
              <option
                key={item}
                value={item}
              >
                {item} Guest{item>1?"s":""}
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
          <span>{guests} Guest{guests>1?"s":""}</span>
        </li>

        <li>
          <FaShieldAlt />
          <span>Free Cancellation</span>
        </li>

      </ul>

      <div className="booking-total">

        <span>Total</span>

        <strong>
          ${destination.price * guests}
        </strong>

      </div>

      <button className="booking-btn">
        Reserve Your Journey
      </button>

      <button className="wishlist-outline">
        Save to Wishlist
      </button>

    </aside>
  );
}

export default BookingCard;