import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getPublicDestinations } from "../services/destinationService";
import { mapDestination } from "../utils/destinationMapper";
import { useSettings } from "../context/SettingsContext";
import { formatPrice } from "../utils/currency";


import "./Packages.css";

const PLACEHOLDER = "https://placehold.co/900x700/162235/B6C2D2?text=No+Image";

function PackageGallery({ destination }) {
  const images = destination.gallery?.length ? destination.gallery : [destination.image];
  const [activeImage, setActiveImage] = useState(images[0]);
  const { settings } = useSettings();

  return (
    <div className="editorial-image">
      <img
        src={activeImage || PLACEHOLDER}
        alt={destination.title}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = PLACEHOLDER;
        }}
      />
      <div className="editorial-image-gradient" />
      <span className="editorial-badge">{destination.duration}</span>
      <span className="editorial-rating-badge">★ {destination.rating}</span>

      {images.length > 1 && (
        <div className="editorial-thumbs" onClick={(e) => e.preventDefault()}>
          {images.slice(0, 5).map((img, i) => (
            <button
              key={i}
              type="button"
              className={`editorial-thumb ${img === activeImage ? "editorial-thumb-active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveImage(img);
              }}
            >
              <img
                src={img}
                alt=""
                onError={(e2) => {
                  e2.target.onerror = null;
                  e2.target.src = PLACEHOLDER;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Packages() {
  const [groupedByCategory, setGroupedByCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const data = await getPublicDestinations();
        const mapped = data.map(mapDestination);

        const groups = {};
        mapped.forEach((destination) => {
          const category = destination.category || "Other";
          if (!groups[category]) groups[category] = [];
          groups[category].push(destination);
        });

        const sortedGroups = Object.entries(groups)
          .map(([category, items]) => ({
            category,
            items: items.sort((a, b) => b.rating - a.rating)
          }))
          .sort((a, b) => b.items.length - a.items.length);

        setGroupedByCategory(sortedGroups);
      } catch {
        setGroupedByCategory([]);
      } finally {
        setLoading(false);
      }
    };

    loadPackages();
  }, []);

  return (
    <main className="packages-page">
      <section
        className="packages-hero"
        style={{ backgroundImage: "url(https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1600&q=80)" }}
      >
        <div className="packages-hero-overlay" />
        <div className="container">
          <div className="section-title" style={{ margin: "0 auto", position: "relative", zIndex: 2 }}>
            <span>Curated Collections</span>
            <h2>Travel Packages by Category</h2>
            <p>Handpicked experiences organized by the kind of journey you're after — from luxury escapes to bold adventures.</p>
          </div>
        </div>
      </section>

      {loading && (
        <div className="container" style={{ padding: "40px 0 160px", textAlign: "center", color: "var(--text-light)" }}>
          Loading packages...
        </div>
      )}

      {!loading && groupedByCategory.length === 0 && (
        <div className="container" style={{ padding: "40px 0 160px", textAlign: "center", color: "var(--text-light)" }}>
          No packages available right now.
        </div>
      )}

      {!loading &&
        groupedByCategory.map(({ category, items }) => (
          <section className="package-category-section" key={category}>
            <div className="container">
              <div className="package-category-header">
                <h3>{category}</h3>
                <span>{items.length} experience{items.length > 1 ? "s" : ""}</span>
              </div>

              <div className="editorial-list">
                {items.map((destination, index) => (
                  <Link
                    to={`/destinations/${destination.slug}`}
                    key={destination.id}
                    className={`editorial-card ${index % 2 === 1 ? "editorial-card-reverse" : ""}`}
                  >
                    <PackageGallery destination={destination} />

                    <div className="editorial-body">
                      <span className="editorial-accent-line" />
                      <span className="editorial-location">{destination.country}</span>
                      <h3>{destination.title}</h3>
                      <p>{destination.shortDescription}</p>

                      <div className="editorial-meta">
                        <div className="editorial-price-block">
                          <span className="editorial-price-label">Starting from</span>
                          <span className="editorial-price">{formatPrice(destination.price, settings.currency)} <small>/ person</small></span>
                        </div>
                      </div>

                      <span className="editorial-cta">
                        View Experience <span className="editorial-arrow">→</span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ))}
    </main>
  );
}