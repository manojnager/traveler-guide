import "./Testimonials.css";
import traveler from "../../assets/images/testimonial-user.jpg";

function Testimonials() {
  return (
    <section className="testimonials">

      <div className="testimonial-overlay"></div>

      <div className="container testimonial-content">

        <span className="testimonial-tag">
          Guest Stories
        </span>

        <h2>
          "One of the finest travel experiences we've ever had.
          Every detail was perfectly planned from arrival to departure."
        </h2>

        <div className="testimonial-user">

          <img
            src={traveler}
            alt="Traveler"
          />

          <div>
            <h4>Emily Carter</h4>
            <p>New York, USA</p>
          </div>

        </div>

      </div>

    </section>
  );
}

export default Testimonials;