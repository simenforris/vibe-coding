export async function GET() {
  const body = `User-agent: *
Disallow: /
`;
  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=300, must-revalidate',
      'x-robots-tag': 'noindex, nofollow',
    },
  });
}
