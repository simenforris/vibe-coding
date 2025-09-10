// Server wrapper: renders form, recent searches, and a Suspense boundary

import { cookies } from 'next/headers';
import RecentSearchesClient from '@/app/components/RecentSearchesClient';

export default async function RS3Progress({ rsn }: { rsn: string }) {
  const name = rsn.trim();

  // Recent searches via cookie
  const cookieStore = await cookies();
  const recentRaw = cookieStore.get('recent_rsn')?.value ?? '[]';
  let recent: string[] = [];
  try {
    recent = JSON.parse(recentRaw);
    if (!Array.isArray(recent)) recent = [];
  } catch {
    recent = [];
  }
  if (name) {
    const next = [name, ...recent.filter((r) => r.toLowerCase() !== name.toLowerCase())].slice(
      0,
      5
    );
    // Show updated list immediately; client will persist cookie
    recent = next;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">RS3 Progress</h1>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
        Enter a RuneScape name to view levels, quest points, and recent achievements.
      </p>

      <form className="mt-6 flex gap-2" action="/" method="get">
        <input
          type="text"
          name="rsn"
          defaultValue={name}
          placeholder="RuneScape name (RS3)"
          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-neutral-500 focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:placeholder:text-neutral-400"
        />
        <button
          type="submit"
          className="bg-primary hover:bg-primary-light dark:hover:bg-primary-dark rounded-md px-4 py-2 text-sm font-medium text-white transition-colors"
        >
          View
        </button>
      </form>

      {recent.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">Recent:</span>
          {recent.map((r) => (
            <a
              key={r}
              href={`/?rsn=${encodeURIComponent(r)}`}
              className="rounded-full border border-neutral-300 bg-white px-3 py-1 text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              {r}
            </a>
          ))}
        </div>
      )}

      {/* Results rendered via parallel route slot (@results). See src/app/@results */}

      {/* Client helper to persist recent searches cookie */}
      <RecentSearchesClient rsn={name} recent={recent} />
    </div>
  );
}
