import { Link } from "react-router-dom";
import "./FeaturedPackages.css";

export default function FeaturedPackages({ destinations = [], loading }) {
  if (!loading && destinations.length === 0) return null;

  return (
    <section className="featured-packages">
      <div className="container">
        <div className="section-heading">
          <span>Signature Experiences</span>
          <h2>Curated Luxury Travel Packages</h2>
          <p>Every journey is carefully designed to deliver exceptional comfort, unforgettable moments and world-class hospitality.</p>
        </div>

        <div className="packages-grid">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="package-card" style={{ background: "#121c2d" }} />
              ))
            : destinations.map((destination) => (
                <div key={destination.id} className="package-card">
                  <div className="package-image">
                    <img
                      src={destination.image}
                      alt={destination.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/800x600/1a1d21/6c7a91?text=No+Image";
                      }}
                    />
                    <span className="package-price">${destination.price}</span>
                  </div>

                  <div className="package-content">
                    <span className="package-meta">
                      {destination.country} · ★ {destination.rating}
                    </span>
                    <h3>{destination.title}</h3>
                    <p>{destination.duration}</p>

                    <Link to={`/destinations/${destination.slug}`} className="package-btn">
                      View Experience
                    </Link>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}