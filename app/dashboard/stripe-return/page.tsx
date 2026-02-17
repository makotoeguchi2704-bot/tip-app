import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function StripeReturnPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_account_id")
    .eq("id", user.id)
    .single();

  if (!profile?.stripe_account_id) {
    redirect("/dashboard");
  }

  // Check if onboarding is complete
  const account = await stripe.accounts.retrieve(profile.stripe_account_id);
  const isOnboarded = account.charges_enabled && account.details_submitted;

  if (isOnboarded) {
    await supabase
      .from("profiles")
      .update({ stripe_onboarded: true })
      .eq("id", user.id);
  }

  return (
    <div className="flex min-h-[calc(100vh-60px)] items-center justify-center bg-retro-dark px-4">
      <div className="border-4 border-retro-green bg-retro-card p-8 text-center">
        {isOnboarded ? (
          <>
            <div className="mb-4 text-4xl text-retro-green">[OK]</div>
            <h1 className="mb-2 text-sm text-retro-green">
              STRIPE SETUP COMPLETE
            </h1>
            <p className="mb-6 text-xs text-retro-dim/70">
              READY TO RECEIVE TIPS
            </p>
          </>
        ) : (
          <>
            <div className="mb-4 text-4xl text-retro-amber">[!]</div>
            <h1 className="mb-2 text-sm text-retro-amber">
              SETUP INCOMPLETE
            </h1>
            <p className="mb-6 text-xs text-retro-dim/70">
              PLEASE COMPLETE STRIPE SETUP
            </p>
          </>
        )}
        <Link
          href="/dashboard"
          className="inline-block border-2 border-retro-green bg-retro-green px-6 py-3 text-xs text-retro-dark transition hover:bg-retro-amber hover:border-retro-amber"
        >
          {">"} DASHBOARD
        </Link>
      </div>
    </div>
  );
}
