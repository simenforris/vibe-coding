import type { NextRequest } from 'next/server';

export const revalidate = 120;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rsn = searchParams.get('rsn') || '';
  const activities = searchParams.get('activities') || '20';
  if (!rsn) return new Response(JSON.stringify({ error: 'Missing rsn' }), { status: 400 });

  const url = `https://apps.runescape.com/runemetrics/profile/profile?user=${encodeURIComponent(
    rsn
  )}&activities=${encodeURIComponent(activities)}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127 Safari/537.36',
      },
      next: { revalidate },
    });
    const body = await res.text();
    return new Response(body, {
      status: res.status,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'public, s-maxage=120, stale-while-revalidate=60',
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Upstream error' }), { status: 502 });
  }
}
