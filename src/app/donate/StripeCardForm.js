"use client";
import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function StripeCardForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!stripe || !elements) return;
    setProcessing(true);

    // For real payments, you need to create a PaymentIntent on your backend and get clientSecret
    // For demo, we'll use a test mode clientSecret (replace with your backend call in production)
    // Example: fetch('/api/create-payment-intent', { method: 'POST', body: { amount } })
    const clientSecret = await fetch("/api/stripe-test-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: parseInt(amount, 10) * 100, email, name }),
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name,
          email,
        },
      },
    });
    setProcessing(false);

    if (result.error) {
      setStatus({ success: false, message: result.error.message });
    } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
      setStatus({ success: true, message: "Donation successful! Thank you!" });
      setAmount("");
      setName("");
      setEmail("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div>
        <label className="block mb-1 font-medium text-gray-700">Name on Card</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Name as it appears on card"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="you@email.com"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium text-gray-700">Card Details</label>
        <div className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white">
          <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
        </div>
      </div>
      <div>
        <label className="block mb-1 font-medium text-gray-700">Donation Amount ($)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="1"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter amount"
        />
      </div>
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        {processing ? "Processing..." : "Donate with Card"}
      </button>
      {status && (
        <div className={`mt-2 text-center font-semibold ${status.success ? "text-green-600" : "text-red-600"}`}>
          {status.message}
        </div>
      )}
    </form>
  );
}
