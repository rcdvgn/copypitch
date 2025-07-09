// lib/stripe-utils.ts
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import Stripe from "stripe";
import { db } from "../_config/firebase/client";
import {
  SUBSCRIPTION_PLANS,
  SubscriptionPlan,
  stripe,
} from "../_lib/stripe/stripe";

// User type for Firestore
export interface User {
  id: string;
  email: string;
  stripeCustomerId?: string;
  subscriptionId?: string;
  subscriptionStatus?: string;
  plan: SubscriptionPlan;
  createdAt: Date;
  updatedAt: Date;
}

// Get or create Stripe customer
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string
): Promise<string> {
  try {
    // Check if user already has a Stripe customer ID
    const userDoc = await getDoc(doc(db, "users", userId));
    const userData = userDoc.data() as User;

    if (userData?.stripeCustomerId) {
      return userData.stripeCustomerId;
    }

    // Create new Stripe customer
    const customer = await stripe.customers.create({
      email,
      metadata: {
        userId,
      },
    });

    // Update user document with Stripe customer ID
    await updateDoc(doc(db, "users", userId), {
      stripeCustomerId: customer.id,
      updatedAt: serverTimestamp(),
    });

    return customer.id;
  } catch (error) {
    console.error("Error creating Stripe customer:", error);
    throw new Error("Failed to create Stripe customer");
  }
}

// Update user subscription in Firestore
export async function updateUserSubscription(
  userId: string,
  subscription: Stripe.Subscription
): Promise<void> {
  try {
    const plan = getSubscriptionPlan(subscription);

    await updateDoc(doc(db, "users", userId), {
      subscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      plan,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating user subscription:", error);
    throw new Error("Failed to update user subscription");
  }
}

// Get subscription plan from Stripe subscription
export function getSubscriptionPlan(
  subscription: Stripe.Subscription
): SubscriptionPlan {
  if (subscription.status === "active" || subscription.status === "trialing") {
    return SUBSCRIPTION_PLANS.STANDARD;
  }
  return SUBSCRIPTION_PLANS.FREE;
}

// Get user by Stripe customer ID
export async function getUserByStripeCustomerId(
  customerId: string
): Promise<User | null> {
  try {
    const customer = await stripe.customers.retrieve(customerId);

    if (customer.deleted) {
      return null;
    }

    const userId = customer.metadata.userId;
    if (!userId) {
      return null;
    }

    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) {
      return null;
    }

    return { id: userId, ...userDoc.data() } as User;
  } catch (error) {
    console.error("Error getting user by Stripe customer ID:", error);
    return null;
  }
}

// Check if user has active subscription
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    const userData = userDoc.data() as User;

    if (!userData?.subscriptionId) {
      return false;
    }
    // Always check with Stripe as source of truth
    const subscription = await stripe.subscriptions.retrieve(
      userData.subscriptionId
    );
    return (
      subscription.status === "active" || subscription.status === "trialing"
    );
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return false;
  }
}

// Get user's current subscription from Stripe
export async function getUserSubscription(
  userId: string
): Promise<Stripe.Subscription | null> {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    const userData = userDoc.data() as User;

    if (!userData?.subscriptionId) {
      return null;
    }
    const subscription = await stripe.subscriptions.retrieve(
      userData.subscriptionId
    );
    return subscription;
  } catch (error) {
    console.error("Error getting user subscription:", error);
    return null;
  }
}
