import RS3Results from '@/app/components/RS3Results';

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function ResultsSlot({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const sp = (await searchParams) ?? {};
  const rsn = (sp.rsn ?? '').toString().trim();
  if (!rsn) return null;
  return (
    <div className="mx-auto max-w-5xl px-4">
      <RS3Results rsn={rsn} />
    </div>
  );
}
