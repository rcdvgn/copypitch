// lib/stripe.ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

// Stripe price IDs - replace with your actual price IDs
export const STRIPE_PRICES = {
  STANDARD_MONTHLY: "price_1Ri5xkPap6U2pugOuldVDPQl", // Replace with your monthly price ID
  STANDARD_YEARLY: "price_1Ri5yXPap6U2pugOY8DriZ4y", // Replace with your yearly price ID
} as const;

export const SUBSCRIPTION_PLANS = {
  FREE: "free",
  STANDARD: "standard",
} as const;

export type SubscriptionPlan =
  (typeof SUBSCRIPTION_PLANS)[keyof typeof SUBSCRIPTION_PLANS];
