const baseUrl = 'https://mqzkim.github.io';

const routes = [
  { path: '/', priority: '1.0' },
  { path: '/tools/vat-calculator/', priority: '0.9' },
  { path: '/tools/margin-calculator/', priority: '0.9' },
  { path: '/tools/wage-converter/', priority: '0.9' },
  { path: '/checklists/quote-checklist/', priority: '0.8' },
  { path: '/checklists/landing-copy-checklist/', priority: '0.8' },
];

const toAbsoluteUrl = (path: string) => `${baseUrl}${path}`;

export function GET() {
  const urls = routes
    .map(
      (route) => `  <url>
    <loc>${toAbsoluteUrl(route.path)}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
    )
    .join('\n');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
