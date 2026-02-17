import Link from "next/link";

export default async function CancelPage({
  searchParams,
}: {
  searchParams: Promise<{ username?: string }>;
}) {
  const { username } = await searchParams;
  const backHref = username ? `/tip/${username}` : "/";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4">
      <div className="text-center">
        <div className="mb-4 text-6xl text-gray-400">&#10005;</div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          キャンセルされました
        </h1>
        <p className="mb-6 text-gray-500">決済はキャンセルされました</p>
        <Link
          href={backHref}
          className="inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          もう一度試す
        </Link>
      </div>
    </div>
  );
}
