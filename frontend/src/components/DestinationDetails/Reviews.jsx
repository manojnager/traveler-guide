import { FaStar } from "react-icons/fa";
import "./Reviews.css";

function Reviews({ destination }) {
  if (!destination.reviews || destination.reviews.length === 0) {
    return (
      <section className="reviews-section">
        <h2>Traveler Reviews</h2>
        <p>No reviews yet — be the first to share your experience.</p>
      </section>
    );
  }

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

              </div>

              <strong><div class="reviews-score">{review.rating}</div></strong>

            </div>

            <p>{review.review}</p>

          </article>
        ))}

      </div>

    </section>
  );
}

export default Reviews;