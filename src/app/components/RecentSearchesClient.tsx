"use client";
import { useEffect } from 'react';

function parseCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

export default function RecentSearchesClient({ rsn, recent }: { rsn: string; recent?: string[] }) {
  useEffect(() => {
    if (!rsn) return;
    let arr: string[] = [];
    try {
      const raw = parseCookie('recent_rsn');
      if (raw) arr = JSON.parse(raw);
      if (!Array.isArray(arr)) arr = [];
    } catch {
      arr = [];
    }

    // Merge server-provided recent with client cookie
    const merged = [rsn, ...(recent || []), ...arr];
    const dedup = Array.from(new Map(merged.map((v) => [v.toLowerCase(), v])).values()).slice(0, 5);

    try {
      document.cookie = `recent_rsn=${encodeURIComponent(JSON.stringify(dedup))}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    } catch {
      // ignore
    }
  }, [rsn, recent]);

  return null;
}

