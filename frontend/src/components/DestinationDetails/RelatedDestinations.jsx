import { useEffect, useState } from "react";

import DestinationCard from "../DestinationCard/DestinationCard";
import { getPublicDestinations } from "../../services/destinationService";
import { mapDestination } from "../../utils/destinationMapper";

import "./RelatedDestinations.css";

function RelatedDestinations({ destination }) {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRelated = async () => {
      setLoading(true);

      try {
        const data = await getPublicDestinations();
        const mapped = data.map(mapDestination);

        const filtered = mapped
          .filter(
            (item) =>
              item.id !== destination.id &&
              (item.category === destination.category ||
                item.featured)
          )
          .slice(0, 3);

        setRelated(filtered);
      } catch {
        setRelated([]);
      } finally {
        setLoading(false);
      }
    };

    loadRelated();
  }, [destination.id, destination.category]);

  if (!loading && related.length === 0) {
    return null;
  }

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
          {loading &&
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="destination-card"
                style={{ background: "#f4f6f8", minHeight: "300px" }}
              />
            ))}

          {!loading &&
            related.map((item) => (
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