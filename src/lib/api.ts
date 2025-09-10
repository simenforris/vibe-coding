import type { HiscoreResponse, RuneMetricsProfile, RuneMetricsQuestsResponse } from '@/lib/types';

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127 Safari/537.36';

export async function fetchHiscore(rsn: string): Promise<HiscoreResponse | null> {
  try {
    const r = await fetch(
      `https://secure.runescape.com/m=hiscore/index_lite.json?player=${encodeURIComponent(rsn)}`,
      { headers: { 'User-Agent': UA }, next: { revalidate: 120 } }
    );
    if (!r.ok) return null;
    return (await r.json()) as HiscoreResponse;
  } catch {
    return null;
  }
}

export async function fetchQuests(rsn: string): Promise<RuneMetricsQuestsResponse | null> {
  try {
    const r = await fetch(
      `https://apps.runescape.com/runemetrics/quests?user=${encodeURIComponent(rsn)}`,
      { headers: { 'User-Agent': UA }, next: { revalidate: 300 } }
    );
    if (!r.ok) return null;
    return (await r.json()) as RuneMetricsQuestsResponse;
  } catch {
    return null;
  }
}

export async function fetchProfile(
  rsn: string,
  activities = 20
): Promise<RuneMetricsProfile | null> {
  try {
    const r = await fetch(
      `https://apps.runescape.com/runemetrics/profile/profile?user=${encodeURIComponent(
        rsn
      )}&activities=${activities}`,
      { headers: { 'User-Agent': UA }, next: { revalidate: 120 } }
    );
    if (!r.ok) return null;
    return (await r.json()) as RuneMetricsProfile;
  } catch {
    return null;
  }
}
