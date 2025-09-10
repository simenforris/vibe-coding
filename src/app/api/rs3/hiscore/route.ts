import type { NextRequest } from 'next/server';

export const revalidate = 120; // seconds

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rsn = searchParams.get('rsn') || '';
  if (!rsn) return new Response(JSON.stringify({ error: 'Missing rsn' }), { status: 400 });

  const url = `https://secure.runescape.com/m=hiscore/index_lite.json?player=${encodeURIComponent(
    rsn
  )}`;
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
