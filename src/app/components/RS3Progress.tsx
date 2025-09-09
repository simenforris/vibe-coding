// RS3 Hiscores (levels)
type HiscoreSkill = {
  id: number;
  name: string;
  rank: number;
  level: number;
  xp: number;
};

type HiscoreResponse = {
  name: string;
  skills: HiscoreSkill[];
};

// RuneMetrics Quests
type RuneMetricsQuest = {
  title: string;
  status: 'COMPLETED' | 'STARTED' | 'NOT_STARTED' | string;
  members?: boolean;
  difficulty?: string;
  questPoints?: number; // optional
};

type RuneMetricsQuestsResponse = {
  quests: RuneMetricsQuest[];
  error?: string;
};

// RuneMetrics Profile + Activities
type RuneMetricsActivity = {
  date: string;
  details?: string;
  text: string;
};

type RuneMetricsProfile = {
  name?: string;
  combatlevel?: number;
  totalSkill?: number;
  questsComplete?: number;
  questsStarted?: number;
  questsNotStarted?: number;
  activities?: RuneMetricsActivity[];
  error?: string;
};

// no-op helper removed; direct fetch is used server-side

function getQuestPoints(quests: RuneMetricsQuest[] | undefined): number | null {
  if (!quests) return null;
  let hasQP = false;
  let qp = 0;
  for (const q of quests) {
    if (q.status === 'COMPLETED' && typeof q.questPoints === 'number') {
      qp += q.questPoints;
      hasQP = true;
    }
  }
  return hasQP ? qp : null;
}

function formatNumber(n: number | undefined | null): string {
  if (typeof n !== 'number') return '-';
  return n.toLocaleString();
}

function bySkillOrder(a: HiscoreSkill, b: HiscoreSkill) {
  return a.id - b.id;
}

export default async function RS3Progress({ rsn }: { rsn: string }) {
  const name = rsn.trim();
  let hiscore: HiscoreResponse | null = null;
  let quests: RuneMetricsQuestsResponse | null = null;
  let profile: RuneMetricsProfile | null = null;

  if (name) {
    const ua =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127 Safari/537.36';
    const [hiscoreRes, questsRes, profileRes] = await Promise.all([
      fetch(`https://secure.runescape.com/m=hiscore/index_lite.json?player=${encodeURIComponent(name)}` , { headers: { 'User-Agent': ua }, next: { revalidate: 120 } })
        .then(async (r) => (r.ok ? (await r.json()) as HiscoreResponse : null))
        .then((d) => ({ ok: !!d, data: d, status: d ? 200 : 500 } as const))
        .catch(() => ({ ok: false, data: null, status: 0 } as const)),
      fetch(`https://apps.runescape.com/runemetrics/quests?user=${encodeURIComponent(name)}`, { headers: { 'User-Agent': ua }, next: { revalidate: 300 } })
        .then(async (r) => (r.ok ? (await r.json()) as RuneMetricsQuestsResponse : null))
        .then((d) => ({ ok: !!d, data: d, status: d ? 200 : 500 } as const))
        .catch(() => ({ ok: false, data: null, status: 0 } as const)),
      fetch(`https://apps.runescape.com/runemetrics/profile/profile?user=${encodeURIComponent(name)}&activities=20`, { headers: { 'User-Agent': ua }, next: { revalidate: 120 } })
        .then(async (r) => (r.ok ? (await r.json()) as RuneMetricsProfile : null))
        .then((d) => ({ ok: !!d, data: d, status: d ? 200 : 500 } as const))
        .catch(() => ({ ok: false, data: null, status: 0 } as const)),
    ]);
    hiscore = hiscoreRes.ok ? hiscoreRes.data : null;
    quests = questsRes.ok ? questsRes.data : null;
    profile = profileRes.ok ? profileRes.data : null;
  }

  const qpTotal = getQuestPoints(quests?.quests);
  const activities = profile?.activities ?? [];

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
          className="rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-light)] dark:hover:bg-[var(--color-primary-dark)]"
        >
          View
        </button>
      </form>

      {name && (
        <div className="mt-8 space-y-8">
          <section>
            <h2 className="text-xl font-medium">Summary</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="text-xs text-neutral-600 dark:text-neutral-400">Account</div>
                <div className="mt-1 break-all text-base font-medium">{name}</div>
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
            <div className="mt-3 text-xs text-neutral-600 dark:text-neutral-400">
              <p>
                Levels from Hiscores; Quests & Activities from RuneMetrics. Some accounts may be
                private or blocked—if data is missing, check RuneMetrics privacy settings.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-medium">Levels</h2>
            {!hiscore && (
              <div className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">Unable to load hiscores.</div>
            )}
            {hiscore && (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {hiscore.skills
                  .filter((s) => s.name !== 'Overall')
                  .sort(bySkillOrder)
                  .map((s) => (
                    <div key={s.id} className="rounded-md border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
                      <div className="text-xs text-neutral-600 dark:text-neutral-400">{s.name}</div>
                      <div className="mt-1 text-base font-medium">{s.level}</div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-500">{formatNumber(s.xp)} xp</div>
                    </div>
                  ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-medium">Recent Activity</h2>
            {!profile && (
              <div className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                Unable to load profile/activity (account may be private).
              </div>
            )}
            {profile && activities?.length === 0 && (
              <div className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">No recent activity found.</div>
            )}
            {profile && activities?.length > 0 && (
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
        </div>
      )}
    </div>
  );
}
