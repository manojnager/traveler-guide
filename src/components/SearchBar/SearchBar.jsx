import "./SearchBar.css";

function SearchBar() {
  return (
    <section className="search-section">
      <div className="container">
        <div className="search-card">
          <div className="search-item">
            <label>Destination</label>
            <input type="text" placeholder="Where to?" />
          </div>

          <div className="search-item">
            <label>Check In</label>
            <input type="date" />
          </div>

          <div className="search-item">
            <label>Guests</label>
            <select>
              <option>2 Guests</option>
              <option>4 Guests</option>
              <option>6 Guests</option>
              <option>8 Guests</option>
            </select>
          </div>

          <button className="search-btn">
            Search
          </button>
        </div>
      </div>
    </section>
  );
}

export default SearchBar;