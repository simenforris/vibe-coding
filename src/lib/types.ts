// Shared RS3 types

export type HiscoreSkill = {
  id: number;
  name: string;
  rank: number;
  level: number;
  xp: number;
};

export type HiscoreResponse = {
  name: string;
  skills: HiscoreSkill[];
};

export type RuneMetricsQuest = {
  title: string;
  status: 'COMPLETED' | 'STARTED' | 'NOT_STARTED' | string;
  members?: boolean;
  difficulty?: string;
  questPoints?: number;
};

export type RuneMetricsQuestsResponse = {
  quests: RuneMetricsQuest[];
  error?: string;
};

export type RuneMetricsActivity = {
  date: string;
  details?: string;
  text: string;
};

export type RuneMetricsProfile = {
  name?: string;
  combatlevel?: number;
  totalSkill?: number;
  questsComplete?: number;
  questsStarted?: number;
  questsNotStarted?: number;
  activities?: RuneMetricsActivity[];
  error?: string;
};
