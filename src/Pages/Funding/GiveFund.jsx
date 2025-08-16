import { useContext, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import CheckoutForm from "./CheckoutForm";
import useAxiosSecure from "../../Hooks/useAxiosSecure";


const stripePromise = loadStripe(import.meta.env.VITE_payment_key);

const GiveFund = () => {
  const { user } = useContext(AuthContext);
  const [amount, setAmount] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (amount > 0) {
      axiosSecure
        .post("/create-payment-intent", { amount })
        .then((res) => {
          setClientSecret(res.data.clientSecret);
        });
    }
  }, [amount]);

  const handleChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-6">
  <div className="max-w-lg w-full card rounded-3xl p-8 md:p-12 lg:p-16">
  <h2 className="text-3xl font-bold mb-6 text-center">
          Make a Donation 💖
        </h2>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="space-y-6 text-gray-700"
        >
          <div>
            <label htmlFor="amount" className="block font-medium mb-1">
              Donation Amount (USD)
            </label>
            <input
              id="amount"
              type="text"
              value={amount}
              onChange={handleChange}
              placeholder="Enter amount..."
              className="w-full border border-gray-300 rounded-xl p-4 text-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              required
            />
          </div>
        </form>

        {clientSecret && (
          <div className="mt-8">
            <Elements options={{ clientSecret }} stripe={stripePromise}>
              <CheckoutForm amount={amount} user={user} />
            </Elements>
          </div>
        )}
      </div>
    </div>
  );
};

export default GiveFund;
