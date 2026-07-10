import "./DestinationFilter.css";

function DestinationFilter({
  search,
  category,
  sort,
  onSearchChange,
  onCategoryChange,
  onSortChange
}) {
  return (
    <section className="destination-filter">
      <div className="container">

        <div className="filter-wrapper">

          <div className="filter-group">
            <label>Search</label>

            <input
              type="text"
              placeholder="Search destination..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Category</label>

            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Beach">Beach</option>
              <option value="Mountain">Mountain</option>
              <option value="Luxury">Luxury</option>
              <option value="Adventure">Adventure</option>
              <option value="City">City</option>
              <option value="Culture">Culture</option>
              <option value="Romantic">Romantic</option>
              <option value="Nature">Nature</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By</label>

            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price Low - High</option>
              <option value="price-high">Price High - Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          <button
            className="filter-btn"
            type="button"
          >
            {search ? "Searching..." : "Search"}
          </button>

        </div>

      </div>
    </section>
  );
}

export default DestinationFilter;