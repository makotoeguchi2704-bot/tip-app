import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import QRDisplay from "./QRDisplay";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/register");
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const tipUrl = `${baseUrl}/tip/${profile.username}`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">ダッシュボード</h1>

        <p className="mb-6 text-gray-600">
          こんにちは、<span className="font-semibold">{profile.display_name}</span> さん
        </p>

        {/* Stripe Connect Status */}
        <div className="mb-6 rounded-xl border-2 border-gray-200 p-4">
          <h2 className="mb-2 font-semibold text-gray-900">決済設定</h2>
          {profile.stripe_onboarded ? (
            <p className="text-sm text-green-600">
              Stripe Connect 設定済み
            </p>
          ) : (
            <div>
              <p className="mb-3 text-sm text-gray-500">
                チップを受け取るにはStripeアカウントの設定が必要です
              </p>
              <a
                href="/api/stripe/connect"
                className="inline-block rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                Stripeアカウントを設定
              </a>
            </div>
          )}
        </div>

        {/* QR Code & Tip Link */}
        <div className="rounded-xl border-2 border-gray-200 p-4">
          <h2 className="mb-2 font-semibold text-gray-900">チップページ</h2>
          <p className="mb-3 break-all text-sm text-gray-500">{tipUrl}</p>
          <QRDisplay url={tipUrl} />
        </div>

        <LogoutButton />
      </div>
    </div>
  );
}

function LogoutButton() {
  return (
    <form className="mt-6">
      <button
        formAction={async () => {
          "use server";
          const supabase = await createClient();
          await supabase.auth.signOut();
          redirect("/login");
        }}
        className="w-full rounded-xl border-2 border-gray-200 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
      >
        ログアウト
      </button>
    </form>
  );
}
