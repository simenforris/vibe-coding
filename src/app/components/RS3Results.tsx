import { fetchHiscore, fetchProfile, fetchQuests } from '@/lib/api';
// no local types needed
import { getQuestPoints } from '@/lib/utils';
import Summary from '@/app/components/Summary';
import LevelsGrid from '@/app/components/LevelsGrid';
import ActivitySection from '@/app/components/ActivitySection';

export default async function RS3Results({ rsn }: { rsn: string }) {
  const name = rsn.trim();

  const [hiscore, quests, profile] = await Promise.all([
    fetchHiscore(name),
    fetchQuests(name),
    fetchProfile(name, 20),
  ]);
  const qpTotal = getQuestPoints(quests?.quests);
  const hadError = !hiscore || !quests || !profile;

  return (
    <div className="mt-8 space-y-8">
      {hadError && (
        <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
          Some data could not be loaded. RuneMetrics may be private or temporarily unavailable.
        </div>
      )}

      <Summary rsn={name} hiscore={hiscore} qpTotal={qpTotal} />

      {!hiscore && (
        <div className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">Unable to load hiscores.</div>
      )}
      {hiscore && <LevelsGrid skills={hiscore.skills} />}

      <ActivitySection profile={profile} />
    </div>
  );
}
