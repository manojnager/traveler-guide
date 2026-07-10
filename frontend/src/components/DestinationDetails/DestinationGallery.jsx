import { useState } from "react";
import "./DestinationGallery.css";

function DestinationGallery({ destination }) {
  const [activeImage, setActiveImage] = useState(destination.gallery[0]);

  return (
    <section className="destination-gallery">
      <div className="container">

        <div className="gallery-main">
          <img
            src={activeImage}
            alt={destination.title}
          />
        </div>

        <div className="gallery-thumbnails">

          {destination.gallery.map((image, index) => (
            <button
              key={index}
              className={`thumbnail ${activeImage === image ? "active" : ""}`}
              onClick={() => setActiveImage(image)}
              type="button"
            >
              <img
                src={image}
                alt={destination.title}
              />
            </button>
          ))}

        </div>

      </div>
    </section>
  );
}

export default DestinationGallery;