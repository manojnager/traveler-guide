import { useState } from "react";
import { FaStar, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";

import { submitReview } from "../../services/reviewService";
import { getImageUrl } from "../../utils/image";

import "./ReviewFormModal.css";

export default function ReviewFormModal({ booking, onClose, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }

    if (reviewText.trim().length < 10) {
      toast.error("Please write at least 10 characters.");
      return;
    }

    setSubmitting(true);

    try {
      await submitReview({
        bookingId: booking.id,
        rating,
        review: reviewText.trim()
      });

      toast.success("Thank you for your review!");
      onSubmitted();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to submit review.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-modal-overlay" onClick={onClose}>
      <div className="review-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="review-modal-close" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="review-modal-destination">
          <img
            src={getImageUrl(booking.destination?.thumbnail)}
            alt={booking.destination?.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/100x100/162235/B6C2D2?text=No+Image";
            }}
          />
          <div>
            <span className="review-modal-eyebrow">Reviewing Your Trip</span>
            <h3>{booking.destination?.title}</h3>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="review-modal-field">
            <label>Your Rating</label>
            <div className="review-modal-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className={`review-star-btn ${(hoverRating || rating) >= star ? "is-filled" : ""}`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <FaStar />
                </button>
              ))}
            </div>
          </div>

          <div className="review-modal-field">
            <label>Your Review</label>
            <textarea
              rows={5}
              placeholder="Tell other travelers about your experience..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <span className="review-modal-char-count">{reviewText.length} / 2000</span>
          </div>

          <button type="submit" className="review-modal-submit-btn" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}