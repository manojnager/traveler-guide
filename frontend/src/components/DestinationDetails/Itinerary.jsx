import "./Itinerary.css";

function Itinerary({ destination }) {
  return (
    <section className="itinerary-section">

      <h2>Travel Itinerary</h2>

      <div className="itinerary-list">

        {destination.itinerary.map((item) => (
          <div
            className="itinerary-item"
            key={item.day}
          >

            <div className="itinerary-day">
              {item.day}
            </div>

            <div className="itinerary-content">

              <h3>{item.title}</h3>

              <p>{item.description}</p>

            </div>

          </div>
        ))}

      </div>

    </section>
  );
}

export default Itinerary;