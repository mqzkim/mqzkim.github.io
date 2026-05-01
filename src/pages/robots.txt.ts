const sitemapUrl = 'https://mqzkim.github.io/sitemap.xml';
const llmsUrl = 'https://mqzkim.github.io/llms.txt';

export function GET() {
  return new Response(`User-agent: *
Allow: /
Sitemap: ${sitemapUrl}
LLM-Content: ${llmsUrl}
`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
