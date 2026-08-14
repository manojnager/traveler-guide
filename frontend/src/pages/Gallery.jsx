import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaExpand, FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { getPublicDestinations } from "../services/destinationService";
import { mapDestination } from "../utils/destinationMapper";

import "./Gallery.css";


function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const data = await getPublicDestinations();
        const mapped = data.map(mapDestination);

        const allImages = [];
        mapped.forEach((destination) => {
          const photos = destination.gallery?.length ? destination.gallery : [destination.image];
          const limitedPhotos = photos.slice(0, 20);

          limitedPhotos.forEach((img) => {
            if (img) {
              allImages.push({
                src: img,
                title: destination.title,
                slug: destination.slug,
                category: destination.category || "Other"
              });
            }
          });
        });

        // Shuffle so same-destination photos aren't clumped together
        for (let i = allImages.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [allImages[i], allImages[j]] = [allImages[j], allImages[i]];
        }

        setImages(allImages);
      } catch {
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);
  

  const categories = useMemo(() => {
    const unique = [...new Set(images.map((img) => img.category).filter(Boolean))];
    return ["All", ...unique];
  }, [images]);

  const filteredImages = useMemo(() => {
    return activeCategory === "All" ? images : images.filter((img) => img.category === activeCategory);
  }, [images, activeCategory]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev === 0 ? filteredImages.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev === filteredImages.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, filteredImages.length]);

  return (
    <main className="gallery-page">
      <section
        className="gallery-hero"
        style={{ backgroundImage: "url(https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600&q=80)" }}
      >
        <div className="gallery-hero-overlay" />
        <div className="container">
          <span>Visual Journey</span>
          <h1>Gallery</h1>
          <p>A glimpse into the destinations, experiences, and moments we curate for our travelers.</p>
        </div>
      </section>

      <section className="section gallery-section">
        <div className="container">
          {!loading && categories.length > 1 && (
            <div className="gallery-filters">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`gallery-filter-chip ${activeCategory === category ? "is-active" : ""}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div className="gallery-masonry">
              {Array.from({ length: Math.floor(Math.random() * 181) + 20 }).map((_, i) => (
                <div key={i} className="gallery-skeleton" style={{ height: `${180 + (i % 3) * 60}px` }} />
              ))}
            </div>
          )}

          {!loading && filteredImages.length === 0 && (
            <p className="gallery-empty">No images available right now.</p>
          )}

          {!loading && filteredImages.length > 0 && (
            <div className="gallery-masonry">
              {filteredImages.map((img, index) => (
                <button
                  type="button"
                  className="gallery-tile"
                  key={`${img.src}-${index}`}
                  onClick={() => setLightboxIndex(index)}
                >
                  <img
                    src={img.src}
                    alt={img.title}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/500x500/162235/B6C2D2?text=No+Image";
                    }}
                  />
                  <div className="gallery-tile-overlay">
                    <div className="gallery-tile-text">
                      <span className="gallery-tile-category">{img.category}</span>
                      <span className="gallery-tile-title">{img.title}</span>
                    </div>
                    <span className="gallery-tile-expand"><FaExpand /></span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {lightboxIndex !== null && filteredImages[lightboxIndex] && (
        <div className="gallery-lightbox" onClick={() => setLightboxIndex(null)}>
          <button className="gallery-lightbox-close" type="button" onClick={() => setLightboxIndex(null)}>
            ×
          </button>

          <button
            type="button"
            className="gallery-lightbox-nav gallery-lightbox-prev"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) => (prev === 0 ? filteredImages.length - 1 : prev - 1));
            }}
            aria-label="Previous image"
          >
            <FaChevronLeft />
          </button>

          <img
            src={filteredImages[lightboxIndex].src}
            alt={filteredImages[lightboxIndex].title}
            onClick={(e) => e.stopPropagation()}
          />

          <button
            type="button"
            className="gallery-lightbox-nav gallery-lightbox-next"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) => (prev === filteredImages.length - 1 ? 0 : prev + 1));
            }}
            aria-label="Next image"
          >
            <FaChevronRight />
          </button>

          <div className="gallery-lightbox-caption">
            <span className="gallery-lightbox-category">{filteredImages[lightboxIndex].category}</span>
            <span className="gallery-lightbox-title">{filteredImages[lightboxIndex].title}</span>
            <Link to={`/destinations/${filteredImages[lightboxIndex].slug}`}>View Destination →</Link>
          </div>

          <span className="gallery-lightbox-counter">
            {lightboxIndex + 1} / {filteredImages.length}
          </span>
        </div>
      )}
    </main>
  );
}

export default Gallery;