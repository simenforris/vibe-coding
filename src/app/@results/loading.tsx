import ResultsSkeleton from '@/app/components/ResultsSkeleton';

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <ResultsSkeleton />
    </div>
  );
}
