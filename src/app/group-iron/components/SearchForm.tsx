import React from 'react';

interface Props {
  size: string;
  competitive: string;
}

export default function SearchForm({ size, competitive }: Props) {
  return (
    <form
      className="mt-6 flex w-full flex-row flex-nowrap items-end gap-3 overflow-x-auto"
      action="/group-iron"
      method="get"
    >
      <div className="min-w-0 flex-1">
        <label
          htmlFor="size"
          className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-400"
        >
          Group size
        </label>
        <select
          id="size"
          name="size"
          required
          defaultValue={size || '2'}
          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
        >
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>

      <div className="min-w-0 flex-1">
        <label
          htmlFor="competitive"
          className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-400"
        >
          Competitive
        </label>
        <select
          id="competitive"
          name="competitive"
          required
          defaultValue={competitive || 'true'}
          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>

      <div className="shrink-0">
        <button
          type="submit"
          className="bg-primary hover:bg-primary-light dark:hover:bg-primary-dark rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}
