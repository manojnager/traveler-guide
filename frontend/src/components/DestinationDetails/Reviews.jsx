import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { getImageUrl } from "../../utils/image";
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

      <div className="reviews-top">

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

      </div>

      <div className="reviews-grid">

        {destination.reviews.map((review) => (
 
          <article
            className="review-card"
            key={review.id}
          >

            <FaQuoteLeft className="review-quote-icon" />

            <p className="review-text">{review.review}</p>

            <div className="review-footer">

              {review.avatar ? (
                <img
                  className="review-avatar"
                  src={getImageUrl(review.avatar)}
                  alt={review.name}
                />
              ) : (
                <div className="review-avatar review-avatar-fallback">
                  {review.name?.[0]}
                </div>
              )}

              <div className="review-footer-info">

                <h3>{review.name}</h3>

                <div className="review-card-stars">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>

              </div>

            </div>

          </article>
        ))}

      </div>

    </section>
  );
}

export default Reviews;