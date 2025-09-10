import type { Metadata } from 'next';
import RS3Progress from '@/app/components/RS3Progress';

type SearchParams = { [key: string]: string | string[] | undefined };

export const metadata: Metadata = {
  title: 'RS3 Progress',
  description: 'View RS3 levels, quest points, and recent achievements',
};

export default async function Page({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const sp = (await searchParams) ?? {};
  const rsn = (sp.rsn ?? '').toString().trim();
  return <RS3Progress rsn={rsn} />;
}
