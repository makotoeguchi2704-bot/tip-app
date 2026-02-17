import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import TipForm from "./TipForm";

export default async function TipPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, stripe_account_id, stripe_onboarded")
    .eq("username", username)
    .single();

  if (!profile) {
    notFound();
  }

  if (!profile.stripe_onboarded || !profile.stripe_account_id) {
    return (
      <div className="flex min-h-[calc(100vh-60px)] items-center justify-center bg-retro-dark px-4">
        <div className="border-4 border-retro-green bg-retro-card p-8 text-center">
          <h1 className="mb-2 text-sm text-retro-green">
            {profile.display_name}
          </h1>
          <p className="text-xs text-retro-dim/70">
            [ERROR] PAYMENT NOT CONFIGURED
          </p>
        </div>
      </div>
    );
  }

  return <TipForm username={profile.username} displayName={profile.display_name} />;
}
