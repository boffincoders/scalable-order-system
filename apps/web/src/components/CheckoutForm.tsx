import { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

interface Props {
  clientSecret: string;
}

export function CheckoutForm({ clientSecret }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    if (!stripe || !elements || isProcessing) return;

    setIsProcessing(true);
    setError(null);

    const card = elements.getElement(CardElement);
    if (!card) {
      setIsProcessing(false);
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card },
    });

    if (result.error) {
      setError(result.error.message || "Payment failed");
      setIsProcessing(false);
      return;
    }

    // Payment succeeded
    setIsProcessing(false);
  }

  return (
    <div>
      <CardElement />

      <button onClick={handlePay} disabled={isProcessing}>
        {isProcessing ? "Processing..." : "Pay"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
