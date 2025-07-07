// app/api/stripe/subscription-status/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  getUserSubscription,
  hasActiveSubscription,
} from "@/app/_utils/stripeUtils";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/_config/firebase/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 }
      );
    }

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();

    // Get subscription from Stripe (source of truth)
    const subscription = await getUserSubscription(userId);
    const isActive = await hasActiveSubscription(userId);

    return NextResponse.json({
      subscription: subscription
        ? {
            id: subscription.id,
            status: subscription.status,
            currentPeriodStart: subscription.items.data[0].current_period_start,
            currentPeriodEnd: subscription.items.data[0].current_period_end,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            items: subscription.items.data.map((item: any) => ({
              priceId: item.price.id,
              productId: item.price.product,
              interval: item.price.recurring?.interval,
              amount: item.price.unit_amount,
              currency: item.price.currency,
            })),
          }
        : null,
      isActive,
      plan: userData.plan || "free",
      stripeCustomerId: userData.stripeCustomerId,
    });
  } catch (error) {
    console.error("Error getting subscription status:", error);
    return NextResponse.json(
      { error: "Failed to get subscription status" },
      { status: 500 }
    );
  }
}
