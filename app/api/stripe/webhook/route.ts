// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/app/_lib/stripe/stripe";
import {
  updateUserSubscription,
  getUserByStripeCustomerId,
} from "@/app/_utils/stripeUtils";
import { doc, updateDoc } from "firebase/firestore";
import Stripe from "stripe";
import { db } from "@/app/_config/firebase/client";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing Stripe signature" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
      console.error("Webhook signature verification failed:", error);
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await handleSubscriptionChange(
          event.data.object as Stripe.Subscription
        );
        break;

      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(
          event.data.object as Stripe.Invoice
        );
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  try {
    const user = await getUserByStripeCustomerId(
      subscription.customer as string
    );

    if (!user) {
      console.error("User not found for customer:", subscription.customer);
      return;
    }

    await updateUserSubscription(user.id, subscription);

    console.log(
      `Updated subscription for user ${user.id}: ${subscription.status}`
    );
  } catch (error) {
    console.error("Error handling subscription change:", error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    const user = await getUserByStripeCustomerId(invoice.customer as string);

    if (!user) {
      console.error("User not found for customer:", invoice.customer);
      return;
    }

    // Update user's last payment date
    await updateDoc(doc(db, "users", user.id), {
      lastPaymentDate: new Date(),
      updatedAt: new Date(),
    });

    console.log(`Payment succeeded for user ${user.id}`);
  } catch (error) {
    console.error("Error handling invoice payment succeeded:", error);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    const user = await getUserByStripeCustomerId(invoice.customer as string);

    if (!user) {
      console.error("User not found for customer:", invoice.customer);
      return;
    }

    // You might want to send notification emails here
    console.log(`Payment failed for user ${user.id}`);
  } catch (error) {
    console.error("Error handling invoice payment failed:", error);
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  try {
    const userId = session.metadata?.userId;

    if (!userId) {
      console.error("No userId in checkout session metadata");
      return;
    }

    if (session.subscription) {
      // Retrieve the subscription to get full details
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
      await updateUserSubscription(userId, subscription);
    }

    console.log(`Checkout completed for user ${userId}`);
  } catch (error) {
    console.error("Error handling checkout session completed:", error);
  }
}
