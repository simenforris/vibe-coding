import type { RuneMetricsProfile } from '@/lib/types';

export default function ActivitySection({ profile }: { profile: RuneMetricsProfile | null }) {
  const activities = profile?.activities ?? [];
  return (
    <section>
      <h2 className="text-xl font-medium">Recent Activity</h2>
      {!profile && (
        <div className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
          Unable to load profile/activity (account may be private).
        </div>
      )}
      {profile && activities.length === 0 && (
        <div className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">No recent activity found.</div>
      )}
      {profile && activities.length > 0 && (
        <ul className="mt-4 space-y-3">
          {activities.map((a, idx) => (
            <li key={idx} className="rounded-md border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="text-sm">{a.text}</div>
              <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">{a.date}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
