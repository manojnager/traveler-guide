import { FaQuoteLeft } from "react-icons/fa";
import { FaStar, FaRegStar } from "react-icons/fa6";
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

  const avgRating = destination.reviews.length
  ? (destination.reviews.reduce((sum, r) => sum + r.rating, 0) / destination.reviews.length).toFixed(1)
  : 0;

  return (
    <section className="reviews-section">

      <div className="reviews-top">

        <h2>Traveler Reviews</h2>

        <div className="reviews-summary">

          <div className="reviews-score">
            {avgRating}
          </div>

          <div>

            <div className="reviews-stars">
              {[1, 2, 3, 4, 5].map((star) =>
                star <= Math.round(avgRating) ? (
                  <FaStar key={star} />
                ) : (
                  <FaRegStar key={star} />
                )
              )}
            </div>
            <p>
              Average rating: {avgRating} based on {destination.reviews.length} verified reviews
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