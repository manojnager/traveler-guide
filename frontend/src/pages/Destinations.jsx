import { useMemo, useState } from "react";

import DestinationCard from "../components/DestinationCard/DestinationCard";
import DestinationFilter from "../components/DestinationFilter/DestinationFilter";
import DestinationsHero from "../components/DestinationsHero/DestinationsHero";

import destinations from "../data/destinations";

function Destinations() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");

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
  }, [search, category, sort]);

  return (
    <>
      <DestinationsHero>
        <DestinationFilter
          search={search}
          category={category}
          sort={sort}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onSortChange={setSort}
        />
      </DestinationsHero>

      <section className="section">
        <div className="container">

          <div className="results-header">
            <h2>
              {filteredDestinations.length} Destination
              {filteredDestinations.length !== 1 && "s"} Found
            </h2>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price Low - High</option>
              <option value="price-high">Price High - Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          <div className="destination-grid">
            {filteredDestinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
              />
            ))}
          </div>

        </div>
      </section>
    </>
  );
}

export default Destinations;