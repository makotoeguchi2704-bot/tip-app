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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            {profile.display_name}
          </h1>
          <p className="text-gray-500">
            このユーザーはまだ決済設定が完了していません
          </p>
        </div>
      </div>
    );
  }

  return <TipForm username={profile.username} displayName={profile.display_name} />;
}
