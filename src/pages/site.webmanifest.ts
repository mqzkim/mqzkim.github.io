const manifest = {
  name: '소상공인 무료 계산기와 체크리스트',
  short_name: '사업자 도구',
  description: '부가세, 마진율, 인건비 계산과 견적서·랜딩 문구 점검을 위한 무료 정적 웹 도구 모음입니다.',
  lang: 'ko-KR',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  background_color: '#f7f9fc',
  theme_color: '#1b66d2',
  icons: [
    { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
  ],
};

export function GET() {
  return new Response(JSON.stringify(manifest, null, 2), {
    headers: {
      'Content-Type': 'application/manifest+json; charset=utf-8',
    },
  });
}
