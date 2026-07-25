import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import DestinationCard from "../components/DestinationCard/DestinationCard";
import DestinationFilter from "../components/DestinationFilter/DestinationFilter";
import DestinationsHero from "../components/DestinationsHero/DestinationsHero";

import { getPublicDestinations } from "../services/destinationService";
import { mapDestination } from "../utils/destinationMapper";

import "./Destinations.css";

function Destinations() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const data = await getPublicDestinations();
        setDestinations(data.map(mapDestination));
      } catch {
        toast.error("Failed to load destinations.");
      } finally {
        setLoading(false);
      }
    };

    loadDestinations();
  }, []);

  useEffect(() => {
    if (search) {
      setSearchParams({ search });
    } else {
      setSearchParams({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const categoryOptions = useMemo(() => {
    const unique = [...new Set(destinations.map((d) => d.category).filter(Boolean))];
    return ["All", ...unique];
  }, [destinations]);

  const filteredDestinations = useMemo(() => {
    let data = [...destinations];

    if (search.trim()) {
      const keyword = search.toLowerCase();
      data = data.filter(
        (item) =>
          item.title.toLowerCase().includes(keyword) ||
          item.country.toLowerCase().includes(keyword)
      );
    }

    if (category !== "All") {
      data = data.filter((item) => item.category === category);
    }

    switch (sort) {
      case "price-low":
        data.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        data.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        data.sort((a, b) => b.rating - a.rating);
        break;
      default:
        data.sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    return data;
  }, [destinations, search, category, sort]);

  return (
    <>
      <DestinationsHero>
        <DestinationFilter
          search={search}
          category={category}
          sort={sort}
          categories={categoryOptions}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onSortChange={setSort}
        />
      </DestinationsHero>

      <section className="section destinations-results">
        <div className="container">
          <div className="results-header">
            <div>
              <h2>
                {loading
                  ? "Loading destinations..."
                  : `${filteredDestinations.length} Destination${
                      filteredDestinations.length !== 1 ? "s" : ""
                    } Found`}
              </h2>
              {category !== "All" && !loading && (
                <p className="results-subtext">
                  Filtered by <strong>{category}</strong>
                </p>
              )}
            </div>
          </div>

          <div className="destinations-page-grid">
            {loading &&
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="destination-card-skeleton" />
              ))}

            {!loading && filteredDestinations.length === 0 && (
              <div className="destinations-empty">
                <h3>No destinations match your search</h3>
                <p>Try adjusting your filters or search for something else.</p>
              </div>
            )}

            {!loading &&
              filteredDestinations.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Destinations;