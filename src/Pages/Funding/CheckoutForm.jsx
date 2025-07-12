import { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import Swal from "sweetalert2";

const CheckoutForm = ({ amount, user }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  const [clientSecret, setClientSecret] = useState(""); // ✅ new state

  // Get clientSecret from backend
  useEffect(() => {
    if (!amount || amount < 1) return;

    axios
      .post("https://blood-sync-server-side.vercel.app/create-payment-intent", { amount })
      .then((res) => {
        setClientSecret(res.data.clientSecret);
      })
      .catch((err) => {
        console.error("Failed to create payment intent", err);
      });
  }, [amount]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || processing) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    setProcessing(true);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      Swal.fire("Payment Error", error.message, "error");
      setProcessing(false);
      return;
    }

    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

    if (confirmError) {
      Swal.fire("Payment Failed", confirmError.message, "error");
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      setTransactionId(paymentIntent.id);

      // Save fund info to DB
      const fundData = {
        name: user?.displayName,
        email: user?.email,
        amount: parseFloat(amount),
        date: new Date(),
        transactionId: paymentIntent.id,
      };

      try {
        await axios.post("https://blood-sync-server-side.vercel.app/fundings", fundData);
        Swal.fire(
          "Success!",
          "Your fund has been recorded. Thank you!",
          "success"
        );
      } catch (dbError) {
        Swal.fire(
          "Saved Locally",
          "Payment succeeded but saving to DB failed.",
          "warning"
        );
      }

      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-100 p-4 rounded-lg border">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#32325d",
                "::placeholder": { color: "#a0aec0" },
              },
              invalid: { color: "#e53e3e" },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-300 shadow-lg"
      >
        {processing ? "Processing..." : `Pay $${amount}`}
      </button>

      {transactionId && (
        <p className="text-green-600 font-medium text-center mt-2">
          Payment successful! Transaction ID: {transactionId}
        </p>
      )}
    </form>
  );
};

export default CheckoutForm;
