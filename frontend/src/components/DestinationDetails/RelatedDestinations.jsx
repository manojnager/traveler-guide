import DestinationCard from "../DestinationCard/DestinationCard";
import destinations from "../../data/destinations";
import "./RelatedDestinations.css";

function RelatedDestinations({ destination }) {
  const related = destinations
    .filter(
      (item) =>
        item.id !== destination.id &&
        (item.category === destination.category ||
          item.featured)
    )
    .slice(0, 3);

  return (
    <section className="related-destinations">
      <div className="container">

        <div className="section-title">

          <span>You May Also Like</span>

          <h2>Related Destinations</h2>

          <p>
            Continue exploring handpicked luxury experiences around the world.
          </p>

        </div>

        <div className="destination-grid">
          {related.map((item) => (
            <DestinationCard
              key={item.id}
              destination={item}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

export default RelatedDestinations;