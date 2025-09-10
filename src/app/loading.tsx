import ResultsSkeleton from '@/app/components/ResultsSkeleton';

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">RS3 Progress</h1>
      {/* Form placeholder */}
      <div className="mt-6 flex gap-2">
        <div className="h-9 w-full rounded-md border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900/60" />
        <div className="bg-primary/80 h-9 w-24 rounded-md" />
      </div>

      <ResultsSkeleton />
    </div>
  );
}
