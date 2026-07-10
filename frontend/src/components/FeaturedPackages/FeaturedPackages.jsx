import "./FeaturedPackages.css";
import packages from "../../data/packages";

function FeaturedPackages() {
  return (
    <section className="featured-packages">
      <div className="container">

        <div className="section-heading">
          <span>Signature Experiences</span>

          <h2>
            Curated Luxury
            <br />
            Travel Packages
          </h2>

          <p>
            Every journey is carefully designed to deliver exceptional comfort,
            unforgettable moments and world-class hospitality.
          </p>
        </div>

        <div className="packages-grid">
          {packages.map((item) => (
            <article
              className="package-card"
              key={item.id}
            >
              <div className="package-image">

                <img
                  src={item.image}
                  alt={item.title}
                />

                <span className="package-price">
                  ${item.price}
                </span>

              </div>

              <div className="package-content">

                <div className="package-meta">
                  <span>{item.location}</span>
                  <span>★ {item.rating}</span>
                </div>

                <h3>{item.title}</h3>

                <p>{item.duration}</p>

                <button>
                  View Experience
                </button>

              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
}

export default FeaturedPackages;