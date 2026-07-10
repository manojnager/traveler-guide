import "./WhyChooseUs.css";
import image from "../../assets/images/why-choose-us.jpg";

const features = [
  "Personal Travel Designer",
  "Handpicked Luxury Hotels",
  "Private Airport Transfers",
  "24/7 Concierge Support"
];

function WhyChooseUs() {
  return (
    <section className="why-choose">
      <div className="container why-grid">
        <div className="why-image">
          <img src={image} alt="Luxury Resort" />

          <div className="experience-card">
            <h3>15+</h3>
            <p>Years of Excellence</p>
          </div>
        </div>

        <div className="why-content">
          <span>Why Choose Us</span>

          <h2>
            Luxury Journeys
            <br />
            Crafted Around You
          </h2>

          <p>
            Every itinerary is thoughtfully designed to match your travel style,
            offering exclusive stays, unforgettable experiences and seamless
            service from beginning to end.
          </p>

          <ul>
            {features.map((item) => (
              <li key={item}>
                <span>✓</span>
                {item}
              </li>
            ))}
          </ul>

          <button>
            Explore Services
          </button>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;