"use client";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51R3kNuIzXmO4TxYQGx5W5rqh0q3tyc05byXWYrMg04HXjT3YLHGeHNlh1V8VQvquwEKnf4jPrVVbe5qeRFtQnvTi006bxx6Hvi");

export default function StripeWrapper({ children }) {
  return <Elements stripe={stripePromise}>{children}</Elements>;
}
