// app/api/stripe/create-portal-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/app/_lib/stripe/stripe";
import { getOrCreateStripeCustomer } from "@/app/_utils/stripeUtils";

export async function POST(request: NextRequest) {
  try {
    const { userId, email } = await request.json();

    // Validate required fields
    if (!userId || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(userId, email);
    // Create portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${request.nextUrl.origin}/t`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Error creating portal session:", error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}
