export default function ResultsSkeleton() {
  return (
    <div className="mt-8 animate-pulse space-y-8">
      <section>
        <div className="h-6 w-32 rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="h-3 w-20 rounded bg-neutral-200 dark:bg-neutral-800" />
              <div className="mt-2 h-5 w-24 rounded bg-neutral-200 dark:bg-neutral-800" />
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="h-6 w-24 rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="rounded-md border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="h-3 w-16 rounded bg-neutral-200 dark:bg-neutral-800" />
              <div className="mt-2 h-4 w-8 rounded bg-neutral-200 dark:bg-neutral-800" />
              <div className="mt-1 h-3 w-14 rounded bg-neutral-200 dark:bg-neutral-800" />
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="h-6 w-40 rounded bg-neutral-200 dark:bg-neutral-800" />
        <ul className="mt-4 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <li
              key={i}
              className="rounded-md border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="h-4 w-64 rounded bg-neutral-200 dark:bg-neutral-800" />
              <div className="mt-2 h-3 w-40 rounded bg-neutral-200 dark:bg-neutral-800" />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
