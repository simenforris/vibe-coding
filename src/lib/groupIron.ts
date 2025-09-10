// RS3 Group Ironman types and type guards

export interface GroupEntry {
  id: number;
  name: string;
  groupTotalXp: number;
  groupTotalLevel: number;
  size: number;
  toHighlight?: boolean;
  isCompetitive: boolean;
  founder?: boolean;
}

export interface GroupScoresResponse {
  content: GroupEntry[];
  totalElements: number;
  totalPages: number;
  first?: boolean;
  last?: boolean;
  numberOfElements?: number;
  pageNumber?: number;
  size: number;
  empty: boolean;
}

function isNumber(x: unknown): x is number {
  return typeof x === 'number' && Number.isFinite(x);
}

function isBoolean(x: unknown): x is boolean {
  return typeof x === 'boolean';
}

function isString(x: unknown): x is string {
  return typeof x === 'string';
}

export function isGroupEntry(x: unknown): x is GroupEntry {
  const o = x as Record<string, unknown>;
  return (
    o !== null &&
    isNumber(o.id) &&
    isString(o.name) &&
    isNumber(o.groupTotalXp) &&
    isNumber(o.groupTotalLevel) &&
    isNumber(o.size) &&
    isBoolean(o.isCompetitive)
  );
}

export function isGroupScoresResponse(x: unknown): x is GroupScoresResponse {
  const o = x as Record<string, unknown>;
  if (!o || typeof o !== 'object') return false;
  const { content, totalElements, totalPages, size, empty } = o as Record<string, unknown>;
  if (!Array.isArray(content)) return false;
  if (!content.every(isGroupEntry)) return false;
  return (
    isNumber(totalElements) && isNumber(totalPages) && isNumber(size) && typeof empty === 'boolean'
  );
}
