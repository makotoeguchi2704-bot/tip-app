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
    <div className="flex min-h-[calc(100vh-60px)] items-center justify-center bg-retro-dark px-4">
      <div className="w-full max-w-md border-4 border-retro-green bg-retro-card p-8">
        <h1 className="mb-6 text-lg text-retro-green">{">"} DASHBOARD</h1>

        <p className="mb-6 text-xs text-retro-dim">
          HELLO, <span className="text-retro-amber">{profile.display_name}</span>
        </p>

        {/* Stripe Connect Status */}
        <div className="mb-6 border-2 border-retro-green p-4">
          <h2 className="mb-2 text-xs text-retro-amber">PAYMENT SETUP</h2>
          {profile.stripe_onboarded ? (
            <p className="text-xs text-retro-green">
              [OK] Stripe Connect
            </p>
          ) : (
            <div>
              <p className="mb-3 text-xs text-retro-dim/70">
                Stripeアカウントの設定が必要です
              </p>
              <a
                href="/api/stripe/connect"
                className="inline-block border-2 border-retro-amber bg-retro-amber px-4 py-2 text-xs text-retro-dark transition hover:bg-retro-green hover:border-retro-green"
              >
                {">"} SETUP STRIPE
              </a>
            </div>
          )}
        </div>

        {/* QR Code & Tip Link */}
        <div className="border-2 border-retro-green p-4">
          <h2 className="mb-2 text-xs text-retro-amber">TIP PAGE</h2>
          <p className="mb-3 break-all text-xs text-retro-dim/70">{tipUrl}</p>
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
        className="w-full border-2 border-retro-green py-3 text-xs text-retro-green transition hover:bg-retro-green hover:text-retro-dark"
      >
        {">"} LOGOUT
      </button>
    </form>
  );
}
