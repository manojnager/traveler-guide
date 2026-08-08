import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { FaLock } from "react-icons/fa";

import "./StripeCardForm.css";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#FFFFFF",
      fontFamily: "'Inter', sans-serif",
      fontSize: "15px",
      "::placeholder": { color: "#6c7a91" }
    },
    invalid: {
      color: "#e5484d"
    }
  }
};

export default function StripeCardForm({ amount, onPaySuccess, onBack }) {
  const stripe = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState(null);

  const handlePay = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);
    setCardError(null);

    try {
      await onPaySuccess(stripe, elements);
    } catch (error) {
      setCardError(error.message || "Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="stripe-card-form">
      <div className="stripe-card-secure-note">
        <FaLock />
        <span>Payments are securely processed by Stripe.</span>
      </div>

      <div className="stripe-card-element-wrapper">
        <CardElement options={CARD_ELEMENT_OPTIONS} onChange={(e) => setCardError(e.error ? e.error.message : null)} />
      </div>

      {cardError && <p className="stripe-card-error">{cardError}</p>}

      <div className="stripe-card-actions">
        <button type="button" className="stripe-card-back-btn" onClick={onBack} disabled={processing}>
          Back
        </button>
        <button type="submit" className="checkout-submit-btn" disabled={!stripe || processing}>
          {processing ? "Processing..." : `Pay $${amount}`}
        </button>
      </div>
    </form>
  );
}