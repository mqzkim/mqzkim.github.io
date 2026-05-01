const siteUrl = 'https://mqzkim.github.io';

const tools = [
  {
    title: '부가세 포함/제외 계산기',
    url: `${siteUrl}/tools/vat-calculator/`,
    summary: '공급가액, 부가세액, 총액을 10% 기본 세율과 반올림 옵션으로 빠르게 계산합니다.',
  },
  {
    title: '마진율·원가·판매가 계산기',
    url: `${siteUrl}/tools/margin-calculator/`,
    summary: '판매가, 원가, 수수료, 배송비, 기타비용을 반영해 예상 이익과 손익분기 판매가를 계산합니다.',
  },
  {
    title: '인건비/시급/월급 환산 계산기',
    url: `${siteUrl}/tools/wage-converter/`,
    summary: '시급과 근무 패턴으로 일급, 주급, 월급, 연 환산액과 실질 시급을 확인합니다.',
  },
  {
    title: '견적서 항목 체크리스트',
    url: `${siteUrl}/checklists/quote-checklist/`,
    summary: '견적 전 작업 범위, 금액·세금, 일정, 결제 조건, 수정·검수 조건 누락을 점검합니다.',
  },
  {
    title: '사업자용 랜딩 문구 템플릿 체크리스트',
    url: `${siteUrl}/checklists/landing-copy-checklist/`,
    summary: '랜딩 공개 전 가치 제안, 혜택, 증거·신뢰, CTA, 리스크 표시 문구를 점검합니다.',
  },
];

const body = `# 소상공인 무료 계산기와 체크리스트

> 부가세, 마진율, 인건비 계산과 견적서·랜딩 문구 점검을 위한 무료 정적 웹 도구 모음입니다.

## 사이트

- 홈: ${siteUrl}/
- 언어: ko-KR
- 대상: 소규모 사업자, 프리랜서, 1인 창업자

## 사용 가능한 도구

${tools.map((tool) => `- [${tool.title}](${tool.url}) — ${tool.summary}`).join('\n')}

## 주의

참고용 도구이며 세무·노무·계약·법률 판단은 전문가 확인이 필요합니다.
`;

export function GET() {
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
