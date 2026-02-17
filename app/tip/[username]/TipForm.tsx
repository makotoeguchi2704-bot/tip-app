"use client";

import { useState } from "react";

const PRESETS = [100, 500, 1000, 3000];

export default function TipForm({
  username,
  displayName,
}: {
  username: string;
  displayName: string;
}) {
  const [amount, setAmount] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePreset = (value: number) => {
    setAmount(value);
    setError("");
  };

  const handleSubmit = async () => {
    const num = Number(amount);
    if (!num || num < 50) {
      setError("50円以上を入力してください");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: num, username }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "エラーが発生しました");
        setLoading(false);
      }
    } catch {
      setError("通信エラーが発生しました");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
          {displayName} にチップを送る
        </h1>
        <p className="mb-6 text-center text-sm text-gray-500">
          金額を選択または入力してください
        </p>

        <div className="mb-4 grid grid-cols-2 gap-3">
          {PRESETS.map((value) => (
            <button
              key={value}
              onClick={() => handlePreset(value)}
              className={`rounded-xl border-2 py-3 text-lg font-semibold transition ${
                amount === value
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
              }`}
            >
              ¥{value.toLocaleString()}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-gray-400">
              ¥
            </span>
            <input
              type="number"
              inputMode="numeric"
              placeholder="カスタム金額"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value === "" ? "" : Number(e.target.value));
                setError("");
              }}
              className="w-full rounded-xl border-2 border-gray-200 py-3 pl-10 pr-4 text-lg font-semibold text-gray-900 outline-none transition focus:border-blue-500"
            />
          </div>
        </div>

        {error && (
          <p className="mb-4 text-center text-sm text-red-500">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !amount}
          className="w-full rounded-xl bg-blue-600 py-3.5 text-lg font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "処理中..." : "支払う"}
        </button>
      </div>
    </div>
  );
}
