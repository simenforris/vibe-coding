import type { HiscoreSkill, RuneMetricsQuest } from '@/lib/types';

export function bySkillOrder(a: HiscoreSkill, b: HiscoreSkill) {
  return a.id - b.id;
}

export function getQuestPoints(quests: RuneMetricsQuest[] | undefined): number | null {
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
