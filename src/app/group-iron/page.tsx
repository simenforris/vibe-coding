import type { Metadata } from 'next';
import type { GroupEntry, GroupScoresResponse } from '@/lib/rs3/groupIron';
import { headers } from 'next/headers';

type SearchParams = { [key: string]: string | string[] | undefined };

export const metadata: Metadata = {
  title: 'Group Ironmen',
  description: 'View RS3 Group Ironman highscores by size and competitive mode',
};

export default async function Page({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const sp = (await searchParams) ?? {};
  const size = (sp.size ?? '').toString().trim();
  const competitive = (sp.competitive ?? '').toString().trim();
  const page = (sp.page ?? '0').toString().trim();
  const DEFAULT_PAGE_SIZE = 25;
  const hasQuery = !!(size && competitive);

  const formatNumber = (n: unknown) => {
    if (typeof n === 'number') return n.toLocaleString();
    const parsed = typeof n === 'string' ? Number(n) : NaN;
    return Number.isFinite(parsed) ? parsed.toLocaleString() : '—';
  };
  const formatCompact = (n: unknown) => {
    const num = typeof n === 'number' ? n : typeof n === 'string' ? Number(n) : NaN;
    if (!Number.isFinite(num)) return '—';
    try {
      return new Intl.NumberFormat(undefined, {
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(num);
    } catch {
      return num.toLocaleString();
    }
  };

  // Server-side fetch via our proxy API
  let result: {
    ok: boolean;
    status: number;
    contentType: string;
    data?: GroupScoresResponse;
    text?: string;
  } | null = null;
  if (hasQuery) {
    const hdrs = await headers();
    const params = new URLSearchParams(
      Object.fromEntries(
        Object.entries({ size, competitive, page, pageSize: String(DEFAULT_PAGE_SIZE) }).filter(
          ([, v]) => !!v
        )
      ) as Record<string, string>
    );
    const configuredBase = process.env.NEXT_PUBLIC_BASE_URL || '';
    const proto = hdrs.get('x-forwarded-proto') ?? 'http';
    const host = hdrs.get('x-forwarded-host') ?? hdrs.get('host') ?? 'localhost:3000';
    const inferredBase = `${proto}://${host}`;
    const base = configuredBase.startsWith('http') ? configuredBase : inferredBase;
    const apiPath = `/api/rs3/groups/scores?${params.toString()}`;
    const apiUrl = (base.endsWith('/') ? base.slice(0, -1) : base) + apiPath;
    try {
      const res = await fetch(apiUrl, {
        headers: { accept: 'application/json,text/plain;q=0.9,*/*;q=0.8' },
        next: { revalidate: 120 },
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = (await res.json()) as GroupScoresResponse;
        result = { ok: res.ok, status: res.status, contentType, data };
      } else {
        const text = await res.text();
        result = { ok: res.ok, status: res.status, contentType, text };
      }
    } catch {
      result = { ok: false, status: 0, contentType: '', text: 'Network or upstream error' };
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Group Ironmen</h1>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
        View Group Ironman highscores by group size and competitive mode.
      </p>

      <form
        className="mt-6 flex w-full flex-row flex-nowrap items-end gap-3 overflow-x-auto"
        action="/group-iron"
        method="get"
      >
        <div className="min-w-0 flex-1">
          <label
            htmlFor="size"
            className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-400"
          >
            Group size
          </label>
          <select
            id="size"
            name="size"
            required
            defaultValue={size || '2'}
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
          >
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>

        <div className="min-w-0 flex-1">
          <label
            htmlFor="competitive"
            className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-400"
          >
            Competitive
          </label>
          <select
            id="competitive"
            name="competitive"
            required
            defaultValue={competitive || 'true'}
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        {/* Pagination is handled by buttons below. */}
        <div className="shrink-0">
          <button
            type="submit"
            className="bg-primary hover:bg-primary-light dark:hover:bg-primary-dark rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {hasQuery && (
        <div className="mt-4 text-sm">
          {/* Render parsed JSON results if available; else raw body */}
          {result && result.data && Array.isArray(result.data.content) ? (
            <div className="mt-3">
              {(() => {
                const pageNum = Number(page) || 0;
                const total =
                  result.data.totalElements ??
                  result.data.numberOfElements ??
                  result.data.content.length;
                const totalPages = result.data.totalPages ?? 0;
                const canPrev = pageNum > 0;
                const canNext = totalPages ? pageNum + 1 < totalPages : true;
                const baseParams = { size, competitive } as Record<string, string>;
                const prevParams = new URLSearchParams({
                  ...baseParams,
                  page: String(Math.max(0, pageNum - 1)),
                  pageSize: String(DEFAULT_PAGE_SIZE),
                });
                const nextParams = new URLSearchParams({
                  ...baseParams,
                  page: String(pageNum + 1),
                  pageSize: String(DEFAULT_PAGE_SIZE),
                });

                return (
                  <>
                    <div className="mb-2 flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
                      <div>
                        Total: {total} • Page: {pageNum + 1} of {totalPages || '?'}
                      </div>
                      <div className="flex gap-2">
                        <a
                          aria-disabled={!canPrev}
                          className={`rounded-md border px-3 py-1 ${canPrev ? 'hover:bg-neutral-100 dark:hover:bg-neutral-800' : 'pointer-events-none opacity-50'} border-neutral-300 dark:border-neutral-700`}
                          href={`/group-iron?${prevParams.toString()}`}
                        >
                          ‹ Prev
                        </a>
                        <a
                          aria-disabled={!canNext}
                          className={`rounded-md border px-3 py-1 ${canNext ? 'hover:bg-neutral-100 dark:hover:bg-neutral-800' : 'pointer-events-none opacity-50'} border-neutral-300 dark:border-neutral-700`}
                          href={`/group-iron?${nextParams.toString()}`}
                        >
                          Next ›
                        </a>
                      </div>
                    </div>

                    <div className="max-h-[60vh] overflow-y-auto rounded-md border border-neutral-200 dark:border-neutral-800">
                      <div className="sticky top-0 z-10 grid grid-cols-[3fr_1fr_1fr] items-center border-b border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                        <div>Group</div>
                        <div className="text-right whitespace-nowrap">Total level</div>
                        <div className="text-right whitespace-nowrap">Total XP</div>
                      </div>
                      <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                        {result.data.content.map((g: GroupEntry, idx: number) => {
                          const rowNumber = pageNum * DEFAULT_PAGE_SIZE + idx + 1;
                          return (
                            <div
                              key={g.id}
                              className="grid grid-cols-[3fr_1fr_1fr] items-center gap-2 p-2"
                            >
                              <div className="min-w-0">
                                <div className="truncate font-medium text-neutral-900 dark:text-neutral-100">
                                  <span className="mr-2 text-xs text-neutral-500 tabular-nums dark:text-neutral-400">
                                    {rowNumber}
                                  </span>
                                  {g.name}
                                </div>
                                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                                  Size {g.size} •{' '}
                                  {g.isCompetitive ? 'Competitive' : 'Non-competitive'}
                                </div>
                              </div>
                              <div className="text-right text-sm text-neutral-800 tabular-nums dark:text-neutral-200">
                                {formatNumber(g.groupTotalLevel)}
                              </div>
                              <div className="text-right text-sm text-neutral-800 tabular-nums dark:text-neutral-200">
                                <span className="sm:hidden">{formatCompact(g.groupTotalXp)}</span>
                                <span className="hidden sm:inline">
                                  {formatNumber(g.groupTotalXp)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : result ? (
            <div className="mt-2 rounded-md bg-neutral-50 p-3 text-xs text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
              {!result.ok && (
                <div className="mb-2 text-red-600 dark:text-red-400">
                  Upstream responded with status {result.status || 'N/A'}
                </div>
              )}
              <pre className="overflow-x-auto whitespace-pre-wrap">
                {(result.text || '').slice(0, 4000) || 'No content'}
              </pre>
              <div className="mt-2 text-neutral-500">
                content-type: {result.contentType || 'unknown'}
              </div>
            </div>
          ) : null}

          {/* Raw API response link removed per request */}
        </div>
      )}
    </div>
  );
}
