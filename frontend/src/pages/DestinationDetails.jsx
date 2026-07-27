import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import toast from "react-hot-toast";

import DestinationGallery from "../components/DestinationDetails/DestinationGallery";
import BookingCard from "../components/DestinationDetails/BookingCard";
import Amenities from "../components/DestinationDetails/Amenities";
import Itinerary from "../components/DestinationDetails/Itinerary";
import Reviews from "../components/DestinationDetails/Reviews";
import RelatedDestinations from "../components/DestinationDetails/RelatedDestinations";
import BookingCTA from "../components/DestinationDetails/BookingCTA";

import { getPublicDestinationBySlug } from "../services/destinationService";
import { mapDestination } from "../utils/destinationMapper";

function DestinationDetails() {
  const { slug } = useParams();

  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadDestination = async () => {
      setLoading(true);
      setNotFound(false);

      try {
        const data = await getPublicDestinationBySlug(slug);
        setDestination(mapDestination(data));
      } catch (error) {
        if (error.response?.status === 404) {
          setNotFound(true);
        } else {
          toast.error("Failed to load destination.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadDestination();
  }, [slug]);

  if (notFound) {
    return <Navigate to="/404" replace />;
  }

  if (loading || !destination) {
    return (
      <main
        className="destination-details"
        style={{ minHeight: "60vh" }}
      />
    );
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
            <BookingCTA
              destinationId={destination.id}
            />

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