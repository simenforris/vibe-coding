import type { Metadata } from 'next';
import type { GroupScoresResponse } from '@/lib/groupIron';
import { headers } from 'next/headers';
import SearchForm from '@/app/group-iron/components/SearchForm';
import GroupResults from '@/app/group-iron/components/GroupResults';

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

  // formatting moved to route-local utils

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
    const apiPath = `/api/groups/scores?${params.toString()}`;
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

      <SearchForm size={size} competitive={competitive} />

      {hasQuery && (
        <div className="mt-4 text-sm">
          {result && result.data && Array.isArray(result.data.content) ? (
            <GroupResults
              data={result.data}
              size={size}
              competitive={competitive}
              page={page}
              defaultPageSize={DEFAULT_PAGE_SIZE}
            />
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
