import type { NextRequest } from 'next/server';
import { isGroupScoresResponse } from '@/lib/rs3/groupIron';

export const revalidate = 120;

// Lists RS3 Group Ironman highscores for a given group size and competitive flag.
// Source: https://runescape.wiki/w/Application_programming_interface#Group_Ironman
// Upstream: https://secure.runescape.com/m=runescape_gim_hiscores//v1/groupScores
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const groupSize = (searchParams.get('size') || '').trim(); // required (2-5)
  const isCompetitive = (searchParams.get('competitive') || 'true').trim(); // default true
  const page = (searchParams.get('page') || '0').trim();
  const pageSize = (searchParams.get('pageSize') || '20').trim();

  // Validate inputs
  const sizeNum = Number(groupSize);
  const pageNum = Number(page);
  const pageSizeNum = Number(pageSize);
  const isCompVal = isCompetitive === 'true' ? 'true' : isCompetitive === 'false' ? 'false' : '';

  if (!Number.isFinite(sizeNum) || sizeNum < 2 || sizeNum > 5) {
    return new Response(JSON.stringify({ error: 'Invalid size. Must be 2, 3, 4, or 5.' }), {
      status: 400,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }
  if (!Number.isFinite(pageNum) || pageNum < 0) {
    return new Response(
      JSON.stringify({ error: 'Invalid page. Must be a non-negative integer.' }),
      {
        status: 400,
        headers: { 'content-type': 'application/json; charset=utf-8' },
      }
    );
  }
  if (!Number.isFinite(pageSizeNum) || pageSizeNum < 1 || pageSizeNum > 200) {
    return new Response(JSON.stringify({ error: 'Invalid pageSize. Use 1-200.' }), {
      status: 400,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }
  if (!isCompVal) {
    return new Response(JSON.stringify({ error: "Invalid competitive. Use 'true' or 'false'." }), {
      status: 400,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }

  const url = new URL('https://secure.runescape.com/m=runescape_gim_hiscores//v1/groupScores');
  url.searchParams.set('groupSize', String(sizeNum));
  url.searchParams.set('size', String(pageSizeNum));
  url.searchParams.set('page', String(pageNum));
  url.searchParams.set('isCompetitive', isCompVal);

  try {
    const res = await fetch(url.toString(), {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127 Safari/537.36',
        Accept: 'application/json',
      },
      next: { revalidate },
    });

    const text = await res.text();
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return new Response(text, {
        status: res.status,
        headers: { 'content-type': contentType || 'text/plain; charset=utf-8' },
      });
    }

    const parsed: unknown = JSON.parse(text);
    if (!isGroupScoresResponse(parsed)) {
      return new Response(JSON.stringify({ error: 'Unexpected upstream response shape.' }), {
        status: 502,
        headers: { 'content-type': 'application/json; charset=utf-8' },
      });
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'public, s-maxage=120, stale-while-revalidate=60',
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Upstream error' }), {
      status: 502,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }
}
