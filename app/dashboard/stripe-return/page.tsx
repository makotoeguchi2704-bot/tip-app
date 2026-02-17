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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4">
      <div className="text-center">
        {isOnboarded ? (
          <>
            <div className="mb-4 text-6xl">&#10003;</div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Stripe設定完了
            </h1>
            <p className="mb-6 text-gray-500">
              チップを受け取る準備ができました
            </p>
          </>
        ) : (
          <>
            <div className="mb-4 text-6xl text-yellow-500">&#9888;</div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              設定が未完了です
            </h1>
            <p className="mb-6 text-gray-500">
              Stripeの設定を完了してください
            </p>
          </>
        )}
        <Link
          href="/dashboard"
          className="inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          ダッシュボードに戻る
        </Link>
      </div>
    </div>
  );
}
