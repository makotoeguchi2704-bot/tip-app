import Link from "next/link";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ username?: string }>;
}) {
  const { username } = await searchParams;
  const backHref = username ? `/tip/${username}` : "/";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-gray-50 px-4">
      <div className="text-center">
        <div className="mb-4 text-6xl">&#10003;</div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          ありがとうございます！
        </h1>
        <p className="mb-6 text-gray-500">チップが正常に送信されました</p>
        <Link
          href={backHref}
          className="inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          戻る
        </Link>
      </div>
    </div>
  );
}
