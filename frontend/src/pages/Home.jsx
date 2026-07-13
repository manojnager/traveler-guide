import { useEffect, useState } from "react";

import Hero from "../components/Hero/Hero";
import PopularDestinations from "../components/PopularDestinations/PopularDestinations";
import FeaturedPackages from "../components/FeaturedPackages/FeaturedPackages";
import WhyChooseUs from "../components/WhyChooseUs/WhyChooseUs";
import Testimonials from "../components/Testimonials/Testimonials";
import Newsletter from "../components/Newsletter/Newsletter";

import { getPublicDestinations } from "../services/destinationService";
import { mapDestination } from "../utils/destinationMapper";

export default function Home() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const data = await getPublicDestinations();
        setDestinations(data.map(mapDestination));
      } catch {
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    };

    loadDestinations();
  }, []);

  const featuredDestinations = destinations.filter((d) => d.featured).slice(0, 4);

  const featuredIds = new Set(featuredDestinations.map((d) => d.id));
  const topRatedDestinations = [...destinations]
    .filter((d) => !featuredIds.has(d.id))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  return (
    <>
      <Hero />
      <PopularDestinations destinations={featuredDestinations} loading={loading} />
      <FeaturedPackages destinations={topRatedDestinations} loading={loading} />
      <WhyChooseUs />
      <Testimonials />
      <Newsletter />
    </>
  );
}