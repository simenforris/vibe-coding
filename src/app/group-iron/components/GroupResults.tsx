import React from 'react';
import type { GroupEntry, GroupScoresResponse } from '@/lib/groupIron';
import { formatCompact, formatNumber } from '@/app/group-iron/utils/format';

interface Props {
  data: GroupScoresResponse;
  size: string;
  competitive: string;
  page: string;
  defaultPageSize: number;
}

export default function GroupResults({ data, size, competitive, page, defaultPageSize }: Props) {
  const pageNum = Number(page) || 0;
  const total = data.totalElements ?? data.numberOfElements ?? data.content.length;
  const totalPages = data.totalPages ?? 0;
  const canPrev = pageNum > 0;
  const canNext = totalPages ? pageNum + 1 < totalPages : true;
  const baseParams = { size, competitive } as Record<string, string>;
  const prevParams = new URLSearchParams({
    ...baseParams,
    page: String(Math.max(0, pageNum - 1)),
    pageSize: String(defaultPageSize),
  });
  const nextParams = new URLSearchParams({
    ...baseParams,
    page: String(pageNum + 1),
    pageSize: String(defaultPageSize),
  });

  return (
    <div className="mt-3">
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
          {data.content.map((g: GroupEntry, idx: number) => {
            const rowNumber = pageNum * defaultPageSize + idx + 1;
            return (
              <div key={g.id} className="grid grid-cols-[3fr_1fr_1fr] items-center gap-2 p-2">
                <div className="min-w-0">
                  <div className="truncate font-medium text-neutral-900 dark:text-neutral-100">
                    <span className="mr-2 text-xs text-neutral-500 tabular-nums dark:text-neutral-400">
                      {rowNumber}
                    </span>
                    {g.name}
                  </div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">
                    Size {g.size} • {g.isCompetitive ? 'Competitive' : 'Non-competitive'}
                  </div>
                </div>
                <div className="text-right text-sm text-neutral-800 tabular-nums dark:text-neutral-200">
                  {formatNumber(g.groupTotalLevel)}
                </div>
                <div className="text-right text-sm text-neutral-800 tabular-nums dark:text-neutral-200">
                  <span className="sm:hidden">{formatCompact(g.groupTotalXp)}</span>
                  <span className="hidden sm:inline">{formatNumber(g.groupTotalXp)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
