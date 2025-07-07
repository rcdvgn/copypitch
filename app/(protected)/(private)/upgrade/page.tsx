"use client";

import React, { useState } from "react";
import { Check, Star, Zap, Shield, Users, Infinity } from "lucide-react";
import { useSubscription } from "@/app/_hooks/useStripe";
import { STRIPE_PRICES } from "@/app/_lib/stripe/stripe";

const UpgradePage = () => {
  const { subscription, loading, createCheckoutSession } = useSubscription();

  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly"
  );

  const standardPrice = billingPeriod === "monthly" ? 9 : 7;
  const standardTotal = billingPeriod === "monthly" ? 9 : 84;
  const savingsPercentage = Math.round(((9 * 12 - 84) / (9 * 12)) * 100);

  const handleSubscribeStandard = () => {
    createCheckoutSession(
      billingPeriod === "monthly"
        ? STRIPE_PRICES.STANDARD_MONTHLY
        : STRIPE_PRICES.STANDARD_YEARLY
    );
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-bg-primary text-text font-sans">
      {/* Header */}
      <div className="border-b border-border bg-bg-secondary/30">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-text m-0">
              Choose Your Plan
            </h1>
            {/* {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text bg-transparent border border-border rounded-lg hover:bg-bg-tertiary transition-colors"
              >
                Maybe Later
              </button>
            )} */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-full mb-6">
            <Zap className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-4xl font-bold text-text mb-4 m-0">
            Unlock Your Full Potential
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Take your template management to the next level with advanced
            features, unlimited storage, and priority support.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-bg-secondary border border-border rounded-lg p-1 inline-flex">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                billingPeriod === "monthly"
                  ? "bg-accent text-white"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-colors relative ${
                billingPeriod === "yearly"
                  ? "bg-accent text-white"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              Yearly
              <span className="absolute -top-1 -right-1 bg-success text-white text-xs px-1.5 py-0.5 rounded-full">
                Save {savingsPercentage}%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Free Plan */}
          <div className="flex flex-col bg-bg-secondary border border-border rounded-xl p-8 relative">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-text m-0">Free</h3>
                <div className="text-sm text-text-secondary bg-bg-tertiary px-2 py-1 rounded">
                  {subscription?.plan === "free" && "Current Plan"}
                </div>
              </div>
              <p className="text-text-secondary mb-4">
                Perfect for getting started with basic template management
              </p>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-text">$0</span>
                <span className="text-text-secondary ml-2">/month</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-success flex-shrink-0" />
                <span className="text-text">Up to 5 templates</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-success flex-shrink-0" />
                <span className="text-text">3 variants per template</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-success flex-shrink-0" />
                <span className="text-text">Basic variable support</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-success flex-shrink-0" />
                <span className="text-text">Community support</span>
              </div>
            </div>

            <button
              //   onClick={() => handleSelectPlan("free")}
              className="mt-auto w-full py-3 px-4 bg-bg-tertiary border border-border text-text font-medium rounded-lg hover:bg-bg-tertiary/80 transition-colors"
            >
              {subscription?.plan === "free" && "Current Plan"}
            </button>
          </div>

          {/* Standard Plan */}
          <div className="flex flex-col bg-bg-secondary border-2 border-accent rounded-xl p-8 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-accent text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Star className="w-4 h-4" />
                Most Popular
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-text m-0">
                  Standard
                </h3>
                <div className="text-sm text-accent bg-accent/20 px-2 py-1 rounded font-medium">
                  Recommended
                </div>
              </div>
              <p className="text-text-secondary mb-4">
                Everything you need for professional template management
              </p>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-text">
                  ${standardPrice}
                </span>
                <span className="text-text-secondary ml-2">
                  /{billingPeriod === "monthly" ? "month" : "month"}
                </span>
              </div>
              {billingPeriod === "yearly" && (
                <div className="mt-2">
                  <div className="text-sm text-text-secondary">
                    <span className="line-through">${9 * 12}</span>
                    <span className="ml-2 text-success font-medium">
                      ${standardTotal}/year - Save ${9 * 12 - standardTotal}!
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-text">
                  <strong>Unlimited templates</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-text">
                  <strong>Unlimited variants</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-text">Advanced variable system</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-text">Team collaboration</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-text">Template sharing</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-text">Advanced analytics</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-text">Priority support</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-text">Custom categories</span>
              </div>
            </div>

            <button
              onClick={handleSubscribeStandard}
              className="mt-auto w-full py-3 px-4 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors"
            >
              {subscription?.isActive ? "Current Plan" : "Upgrade to Standard"}
            </button>
          </div>
        </div>

        {/* Features Highlight */}
        <div className="bg-bg-secondary/50 border border-border rounded-xl p-8 mb-16">
          <h3 className="text-xl font-semibold text-text mb-6 text-center m-0">
            Why Upgrade to Standard?
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/20 rounded-full mb-4">
                <Infinity className="w-6 h-6 text-accent" />
              </div>
              <h4 className="text-lg font-medium text-text mb-2 m-0">
                Unlimited Everything
              </h4>
              <p className="text-text-secondary text-sm">
                Create unlimited templates and variants without any restrictions
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/20 rounded-full mb-4">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h4 className="text-lg font-medium text-text mb-2 m-0">
                Team Collaboration
              </h4>
              <p className="text-text-secondary text-sm">
                Share templates with your team and collaborate in real-time
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/20 rounded-full mb-4">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h4 className="text-lg font-medium text-text mb-2 m-0">
                Priority Support
              </h4>
              <p className="text-text-secondary text-sm">
                Get help when you need it with our dedicated support team
              </p>
            </div>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-success/20 rounded-full mb-4">
            <Shield className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-xl font-semibold text-text mb-2 m-0">
            30-Day Money-Back Guarantee
          </h3>
          <p className="text-text-secondary">
            Try Standard risk-free. If you're not completely satisfied, we'll
            refund your payment.
          </p>
        </div>
      </div>

      {/* Footer Legal Notice */}
      <div className="border-t border-border bg-bg-secondary/30 mt-auto">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="text-center text-sm text-text-secondary leading-relaxed">
            <p className="mb-2">
              By selecting a plan, you agree to our{" "}
              <a
                href="#"
                className="text-accent hover:text-accent/80 underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-accent hover:text-accent/80 underline"
              >
                Privacy Policy
              </a>
              .
            </p>
            <p className="mb-0">
              Standard plan automatically renews{" "}
              {billingPeriod === "monthly" ? "monthly" : "yearly"}. Cancel
              anytime from your account settings. All prices are in USD and
              exclude applicable taxes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;
