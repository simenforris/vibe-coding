import type { HiscoreResponse } from '@/lib/types';
import { formatNumber } from '@/lib/format';

export default function Summary({
  rsn,
  hiscore,
  qpTotal,
}: {
  rsn: string;
  hiscore: HiscoreResponse | null;
  qpTotal: number | null;
}) {
  return (
    <section>
      <h2 className="text-xl font-medium">Summary</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="text-xs text-neutral-600 dark:text-neutral-400">Account</div>
          <div className="mt-1 text-base font-medium break-all">{rsn}</div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="text-xs text-neutral-600 dark:text-neutral-400">Total Level</div>
          <div className="mt-1 text-base font-medium">
            {formatNumber(hiscore?.skills?.find((s) => s.name === 'Overall')?.level)}
          </div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="text-xs text-neutral-600 dark:text-neutral-400">Total XP</div>
          <div className="mt-1 text-base font-medium">
            {formatNumber(hiscore?.skills?.find((s) => s.name === 'Overall')?.xp)}
          </div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="text-xs text-neutral-600 dark:text-neutral-400">Quest Points</div>
          <div className="mt-1 text-base font-medium">
            {qpTotal !== null ? formatNumber(qpTotal) : '—'}
          </div>
        </div>
      </div>
    </section>
  );
}
