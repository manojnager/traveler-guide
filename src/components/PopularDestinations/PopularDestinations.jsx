import "./PopularDestinations.css";

import maldives from "../../assets/images/destinations/maldives.jpg";
import bali from "../../assets/images/destinations/bali.jpg";
import santorini from "../../assets/images/destinations/santorini.jpg";
import switzerland from "../../assets/images/destinations/switzerland.jpg";

const destinations = [
  {
    title: "Maldives",
    country: "Indian Ocean",
    properties: "32 Luxury Resorts",
    image: maldives
  },
  {
    title: "Santorini",
    country: "Greece",
    properties: "18 Luxury Hotels",
    image: santorini
  },
  {
    title: "Bali",
    country: "Indonesia",
    properties: "41 Private Villas",
    image: bali
  },
  {
    title: "Switzerland",
    country: "Swiss Alps",
    properties: "27 Mountain Resorts",
    image: switzerland
  }
];

function PopularDestinations() {
  return (
    <section className="destinations">
      <div className="container">

        <div className="section-heading">
          <span>Luxury Destinations</span>

          <h2>
            Explore The World's
            <br />
            Finest Escapes
          </h2>

          <p>
            Discover handpicked destinations offering unforgettable experiences,
            breathtaking landscapes and world-class hospitality.
          </p>
        </div>

        <div className="destination-grid">
          {destinations.map((item) => (
            <article
              className="destination-card"
              key={item.title}
            >
              <img src={item.image} alt={item.title} />

              <div className="destination-overlay">
                <div>
                  <small>{item.country}</small>

                  <h3>{item.title}</h3>

                  <p>{item.properties}</p>
                </div>

                <button>
                  Explore
                </button>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}

export default PopularDestinations;