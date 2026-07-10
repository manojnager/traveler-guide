import { useParams, Navigate } from "react-router-dom";

import destinations from "../data/destinations";

import DestinationGallery from "../components/DestinationDetails/DestinationGallery";
import BookingCard from "../components/DestinationDetails/BookingCard";
import Amenities from "../components/DestinationDetails/Amenities";
import Itinerary from "../components/DestinationDetails/Itinerary";
import Reviews from "../components/DestinationDetails/Reviews";
import RelatedDestinations from "../components/DestinationDetails/RelatedDestinations";
import BookingCTA from "../components/DestinationDetails/BookingCTA";

function DestinationDetails() {
  const { slug } = useParams();

  const destination = destinations.find(
    (item) => item.slug === slug
  );

  if (!destination) {
    return <Navigate to="/404" replace />;
  }

  return (
    <main className="destination-details">

      <DestinationGallery
        destination={destination}
      />

      <section className="section">
        <div className="container details-layout">

          <div className="details-content">

            <span className="destination-category">
              {destination.category}
            </span>

            <h1>{destination.title}</h1>

            <p className="details-description">
              {destination.description}
            </p>

            <Amenities
              destination={destination}
            />
            <Itinerary
              destination={destination}
            />
            <Reviews destination={destination} />
            <RelatedDestinations
              destination={destination}
            />
            <BookingCTA />

          </div>

          <BookingCard
            destination={destination}
          />

        </div>
      </section>

    </main>
  );
}

export default DestinationDetails;