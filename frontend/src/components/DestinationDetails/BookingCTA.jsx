import { Link } from "react-router-dom";
import ROUTES from "../../constants/routes";
import "./BookingCTA.css";

function BookingCTA() {
  return (
    <section className="booking-cta">

      <div className="container">

        <div className="booking-cta-box">

          <span>Luxury Awaits</span>

          <h2>
            Ready For Your Next Adventure?
          </h2>

          <p>
            Reserve your luxury journey today and create unforgettable memories.
          </p>

          <Link
            to={ROUTES.BOOKING}
            className="booking-cta-btn"
          >
            Reserve Your Journey
          </Link>

        </div>

      </div>

    </section>
  );
}

export default BookingCTA;