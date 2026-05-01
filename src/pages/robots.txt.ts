const sitemapUrl = 'https://mqzkim.github.io/sitemap.xml';

export function GET() {
  return new Response(`User-agent: *
Allow: /
Sitemap: ${sitemapUrl}
`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
