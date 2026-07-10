import { FaCheck } from "react-icons/fa";

import "./Amenities.css";

function Amenities({ destination }) {
  return (
    <>
      <h2>Amenities</h2>

      <div className="amenities">

        {destination.amenities.map((item) => (
          <div
            className="amenity"
            key={item}
          >
            <FaCheck />

            <span>{item}</span>

          </div>
        ))}

      </div>

      <h2>Highlights</h2>

      <div className="amenities">

        {destination.highlights.map((item) => (
          <div
            className="amenity"
            key={item}
          >
            <FaCheck />

            <span>{item}</span>

          </div>
        ))}

      </div>
    </>
  );
}

export default Amenities;