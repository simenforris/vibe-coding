// Server component responsible for data fetching and rendering results
import SkillIcon from '@/app/components/SkillIcon';
type HiscoreSkill = {
  id: number;
  name: string;
  rank: number;
  level: number;
  xp: number;
};
type HiscoreResponse = { name: string; skills: HiscoreSkill[] };

type RuneMetricsQuest = {
  title: string;
  status: 'COMPLETED' | 'STARTED' | 'NOT_STARTED' | string;
  questPoints?: number;
};
type RuneMetricsQuestsResponse = { quests: RuneMetricsQuest[]; error?: string };

type RuneMetricsActivity = { date: string; details?: string; text: string };
type RuneMetricsProfile = {
  activities?: RuneMetricsActivity[];
  error?: string;
};

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

// Map RS3 skill names (as returned by hiscores) to icon URLs on the RuneScape Wiki
const RS3_SKILL_ICON_URLS: Record<string, string> = {
  Attack: 'https://runescape.wiki/images/Attack-icon.png',
  Defence: 'https://runescape.wiki/images/Defence-icon.png',
  Strength: 'https://runescape.wiki/images/Strength-icon.png',
  Hitpoints: 'https://runescape.wiki/images/Constitution-icon.png', // RS3 uses Constitution; hiscores may say Hitpoints
  Ranged: 'https://runescape.wiki/images/Ranged-icon.png',
  Prayer: 'https://runescape.wiki/images/Prayer-icon.png',
  Magic: 'https://runescape.wiki/images/Magic-icon.png',
  Cooking: 'https://runescape.wiki/images/Cooking-icon.png',
  Woodcutting: 'https://runescape.wiki/images/Woodcutting-icon.png',
  Fletching: 'https://runescape.wiki/images/Fletching-icon.png',
  Fishing: 'https://runescape.wiki/images/Fishing-icon.png',
  Firemaking: 'https://runescape.wiki/images/Firemaking-icon.png',
  Crafting: 'https://runescape.wiki/images/Crafting-icon.png',
  Smithing: 'https://runescape.wiki/images/Smithing-icon.png',
  Mining: 'https://runescape.wiki/images/Mining-icon.png',
  Herblore: 'https://runescape.wiki/images/Herblore-icon.png',
  Agility: 'https://runescape.wiki/images/Agility-icon.png',
  Thieving: 'https://runescape.wiki/images/Thieving-icon.png',
  Slayer: 'https://runescape.wiki/images/Slayer-icon.png',
  Farming: 'https://runescape.wiki/images/Farming-icon.png',
  Runecrafting: 'https://runescape.wiki/images/Runecrafting-icon.png',
  Hunter: 'https://runescape.wiki/images/Hunter-icon.png',
  Construction: 'https://runescape.wiki/images/Construction-icon.png',
  Summoning: 'https://runescape.wiki/images/Summoning-icon.png',
  Dungeoneering: 'https://runescape.wiki/images/Dungeoneering-icon.png',
  Divination: 'https://runescape.wiki/images/Divination-icon.png',
  Invention: 'https://runescape.wiki/images/Invention-icon.png',
  Archaeology: 'https://runescape.wiki/images/Archaeology-icon.png',
  Necromancy: 'https://runescape.wiki/images/Necromancy-icon.png',
};

// Prefer ID-based mapping to avoid name mismatches
const RS3_SKILL_ICON_BY_ID: Record<number, string> = {
  1: RS3_SKILL_ICON_URLS.Attack,
  2: RS3_SKILL_ICON_URLS.Defence,
  3: RS3_SKILL_ICON_URLS.Strength,
  4: RS3_SKILL_ICON_URLS.Hitpoints,
  5: RS3_SKILL_ICON_URLS.Ranged,
  6: RS3_SKILL_ICON_URLS.Prayer,
  7: RS3_SKILL_ICON_URLS.Magic,
  8: RS3_SKILL_ICON_URLS.Cooking,
  9: RS3_SKILL_ICON_URLS.Woodcutting,
  10: RS3_SKILL_ICON_URLS.Fletching,
  11: RS3_SKILL_ICON_URLS.Fishing,
  12: RS3_SKILL_ICON_URLS.Firemaking,
  13: RS3_SKILL_ICON_URLS.Crafting,
  14: RS3_SKILL_ICON_URLS.Smithing,
  15: RS3_SKILL_ICON_URLS.Mining,
  16: RS3_SKILL_ICON_URLS.Herblore,
  17: RS3_SKILL_ICON_URLS.Agility,
  18: RS3_SKILL_ICON_URLS.Thieving,
  19: RS3_SKILL_ICON_URLS.Slayer,
  20: RS3_SKILL_ICON_URLS.Farming,
  21: RS3_SKILL_ICON_URLS.Runecrafting,
  22: RS3_SKILL_ICON_URLS.Hunter,
  23: RS3_SKILL_ICON_URLS.Construction,
  24: RS3_SKILL_ICON_URLS.Summoning,
  25: RS3_SKILL_ICON_URLS.Dungeoneering,
  26: RS3_SKILL_ICON_URLS.Divination,
  27: RS3_SKILL_ICON_URLS.Invention,
  28: RS3_SKILL_ICON_URLS.Archaeology,
  29: RS3_SKILL_ICON_URLS.Necromancy,
};

function getSkillIconUrl(skill: HiscoreSkill): string | undefined {
  return RS3_SKILL_ICON_BY_ID[skill.id] || RS3_SKILL_ICON_URLS[skill.name];
}

export default async function RS3Results({ rsn }: { rsn: string }) {
  const name = rsn.trim();
  const ua =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127 Safari/537.36';

  const [hiscoreRes, questsRes, profileRes] = await Promise.all([
    fetch(`https://secure.runescape.com/m=hiscore/index_lite.json?player=${encodeURIComponent(name)}`, {
      headers: { 'User-Agent': ua },
      next: { revalidate: 120 },
    })
      .then(async (r) => (r.ok ? (await r.json()) as HiscoreResponse : null))
      .then((d) => ({ ok: !!d, data: d, status: d ? 200 : 500 } as const))
      .catch(() => ({ ok: false, data: null, status: 0 } as const)),
    fetch(`https://apps.runescape.com/runemetrics/quests?user=${encodeURIComponent(name)}`, {
      headers: { 'User-Agent': ua },
      next: { revalidate: 300 },
    })
      .then(async (r) => (r.ok ? (await r.json()) as RuneMetricsQuestsResponse : null))
      .then((d) => ({ ok: !!d, data: d, status: d ? 200 : 500 } as const))
      .catch(() => ({ ok: false, data: null, status: 0 } as const)),
    fetch(
      `https://apps.runescape.com/runemetrics/profile/profile?user=${encodeURIComponent(name)}&activities=20`,
      { headers: { 'User-Agent': ua }, next: { revalidate: 120 } },
    )
      .then(async (r) => (r.ok ? (await r.json()) as RuneMetricsProfile : null))
      .then((d) => ({ ok: !!d, data: d, status: d ? 200 : 500 } as const))
      .catch(() => ({ ok: false, data: null, status: 0 } as const)),
  ]);

  const hiscore = hiscoreRes.ok ? hiscoreRes.data : null;
  const quests = questsRes.ok ? questsRes.data : null;
  const profile = profileRes.ok ? profileRes.data : null;
  const qpTotal = getQuestPoints(quests?.quests);
  const activities = profile?.activities ?? [];

  const hadError = !hiscore || !quests || !profile;

  return (
    <div className="mt-8 space-y-8">
      {hadError && (
        <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
          Some data could not be loaded. RuneMetrics may be private or temporarily unavailable.
        </div>
      )}

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
                  <div className="flex items-center gap-2">
                    <SkillIcon src={getSkillIconUrl(s)} alt={`${s.name} icon`} size={20} />
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">{s.name}</div>
                  </div>
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
  );
}
