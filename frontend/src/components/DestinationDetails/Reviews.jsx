import { FaStar } from "react-icons/fa";
import "./Reviews.css";

function Reviews({ destination }) {
  return (
    <section className="reviews-section">

      <h2>Traveler Reviews</h2>

      <div className="reviews-summary">

        <div className="reviews-score">
          {destination.rating}
        </div>

        <div>

          <div className="reviews-stars">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>

          <p>
            Based on {destination.reviews.length} verified reviews
          </p>

        </div>

      </div>

      <div className="reviews-grid">

        {destination.reviews.map((review) => (
          <article
            className="review-card"
            key={review.id}
          >

            <div className="review-header">

              <div>

                <h3>{review.name}</h3>

                <span>{review.country}</span>

              </div>

              <strong>{review.rating}</strong>

            </div>

            <p>{review.review}</p>

          </article>
        ))}

      </div>

    </section>
  );
}

export default Reviews;