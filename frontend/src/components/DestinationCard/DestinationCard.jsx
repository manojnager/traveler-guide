import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaStar, FaClock } from "react-icons/fa";
import { useState } from "react";
import "./DestinationCard.css";

function DestinationCard({ destination }) {
  const [favorite, setFavorite] = useState(false);

  return (
    <article className="destination-card">
      <div className="destination-image">

        <img
          src={destination.image}
          alt={destination.title}
        />

        {destination.featured && (
          <span className="featured-badge">
            Featured
          </span>
        )}

        <button
          className="wishlist-btn"
          onClick={() => setFavorite(!favorite)}
        >
          {favorite ? <FaHeart /> : <FaRegHeart />}
        </button>

        <span className="destination-price">
          ${destination.price}
        </span>

      </div>

      <div className="destination-content">

        <span className="destination-category">
          {destination.category}
        </span>

        <h3>{destination.title}</h3>

        <p>{destination.country}</p>

        <div className="destination-meta">

          <span>
            <FaClock />
            {destination.duration}
          </span>

          <span>
            <FaStar />
            {destination.rating}
          </span>

        </div>

        <Link
          className="destination-btn"
          to={`/destinations/${destination.slug}`}
        >
          View Details
        </Link>

      </div>
    </article>
  );
}

export default DestinationCard;