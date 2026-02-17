import Link from "next/link";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ username?: string }>;
}) {
  const { username } = await searchParams;
  const backHref = username ? `/tip/${username}` : "/";

  return (
    <div className="flex min-h-[calc(100vh-60px)] items-center justify-center bg-retro-dark px-4">
      <div className="border-4 border-retro-green bg-retro-card p-8 text-center">
        <div className="mb-4 text-4xl text-retro-green">[OK]</div>
        <h1 className="mb-2 text-sm text-retro-green">
          THANK YOU!
        </h1>
        <p className="mb-6 text-xs text-retro-dim/70">TIP SENT SUCCESSFULLY</p>
        <Link
          href={backHref}
          className="inline-block border-2 border-retro-green bg-retro-green px-6 py-3 text-xs text-retro-dark transition hover:bg-retro-amber hover:border-retro-amber"
        >
          {">"} BACK
        </Link>
      </div>
    </div>
  );
}
