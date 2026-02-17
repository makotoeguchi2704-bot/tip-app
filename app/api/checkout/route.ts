import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { amount, username } = await req.json();

  if (!amount || typeof amount !== "number" || amount < 50 || amount > 1000000) {
    return NextResponse.json(
      { error: "金額は50円〜1,000,000円の範囲で指定してください" },
      { status: 400 }
    );
  }

  if (!username || typeof username !== "string") {
    return NextResponse.json(
      { error: "ユーザー名が必要です" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, stripe_account_id, stripe_onboarded")
    .eq("username", username)
    .single();

  if (!profile || !profile.stripe_onboarded || !profile.stripe_account_id) {
    return NextResponse.json(
      { error: "このユーザーは決済を受け取れません" },
      { status: 400 }
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "jpy",
          product_data: {
            name: `Tip for ${profile.display_name}`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      transfer_data: {
        destination: profile.stripe_account_id,
      },
    },
    success_url: `${baseUrl}/success?username=${username}`,
    cancel_url: `${baseUrl}/cancel?username=${username}`,
  });

  return NextResponse.json({ url: session.url });
}
