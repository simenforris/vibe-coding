import type { HiscoreSkill } from '@/lib/types';
import { bySkillOrder } from '@/lib/utils';
import { getSkillIconUrl } from '@/lib/icons';
import { formatNumber } from '@/lib/format';
import SkillIcon from '@/app/components/SkillIcon';

export default function LevelsGrid({ skills }: { skills: HiscoreSkill[] }) {
  return (
    <section>
      <h2 className="text-xl font-medium">Levels</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {skills
          .filter((s) => s.name !== 'Overall')
          .sort(bySkillOrder)
          .map((s) => (
            <div
              key={s.id}
              className="rounded-md border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex items-center gap-2">
                <SkillIcon src={getSkillIconUrl(s)} alt={`${s.name} icon`} size={20} />
                <div className="text-xs text-neutral-600 dark:text-neutral-400">{s.name}</div>
              </div>
              <div className="mt-1 text-base font-medium">{s.level}</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-500">
                {formatNumber(s.xp)} xp
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
