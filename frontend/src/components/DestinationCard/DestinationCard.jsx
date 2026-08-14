import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaStar, FaClock, FaMapMarkerAlt, FaUserFriends } from "react-icons/fa";
import { useState } from "react";
import "./DestinationCard.css";
import { useSettings } from "../../context/SettingsContext";
import { formatPrice } from "../../utils/currency";

function DestinationCard({ destination }) {
  const [favorite, setFavorite] = useState(false);
  const { settings } = useSettings();

  const reviewCount = destination.reviews?.length || 0;
  const avgRating = reviewCount
    ? (destination.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1)
    : destination.rating;

  return (
    <article className="destination-card">
      <div className="destination-image">
        <img
          src={destination.image}
          alt={destination.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/600x400/162235/B6C2D2?text=No+Image";
          }}
        />
        <div className="destination-image-gradient" />

        {destination.featured && <span className="featured-badge">Featured</span>}

        <button
          className="wishlist-btn"
          type="button"
          onClick={() => setFavorite(!favorite)}
          aria-label="Toggle wishlist"
        >
          {favorite ? <FaHeart /> : <FaRegHeart />}
        </button>

        <span className="destination-rating-badge">
          <FaStar />
          {avgRating}
          {reviewCount > 0 && <em>({reviewCount} Reviews)</em>}
        </span>

        <div className="destination-image-location">
          <FaMapMarkerAlt /> {destination.location}
        </div>
      </div>

      <div className="destination-content">
        <span className="destination-category">{destination.category}</span>

        <h3>{destination.title}</h3>

        {destination.shortDescription && (
          <p className="destination-description">{destination.shortDescription}</p>
        )}

        <div className="destination-meta">
          <span>
            <FaClock /> {destination.duration}
          </span>
          {destination.maxGuests && (
            <span>
              <FaUserFriends /> Up to {destination.maxGuests}
            </span>
          )}
        </div>

        <div className="destination-footer">
          <div className="destination-price-block">
            <span className="destination-price-label">From</span>
            <span className="destination-price">{formatPrice(destination.price, settings.currency)}</span>
          </div>

          <Link className="destination-btn" to={`/destinations/${destination.slug}`}>
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default DestinationCard;