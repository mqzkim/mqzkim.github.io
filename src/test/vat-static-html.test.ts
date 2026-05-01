import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, beforeAll } from 'vitest';

const projectRoot = process.cwd();
const homeHtmlPath = join(projectRoot, 'dist/index.html');
const vatHtmlPath = join(projectRoot, 'dist/tools/vat-calculator/index.html');
const marginHtmlPath = join(projectRoot, 'dist/tools/margin-calculator/index.html');
const wageHtmlPath = join(projectRoot, 'dist/tools/wage-converter/index.html');
const quoteHtmlPath = join(projectRoot, 'dist/checklists/quote-checklist/index.html');
const landingCopyHtmlPath = join(projectRoot, 'dist/checklists/landing-copy-checklist/index.html');
const sitemapXmlPath = join(projectRoot, 'dist/sitemap.xml');
const robotsTxtPath = join(projectRoot, 'dist/robots.txt');

beforeAll(() => {
  execFileSync('npm', ['run', 'build'], {
    cwd: projectRoot,
    env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
    stdio: 'pipe',
  });
});

describe('built home static HTML', () => {
  it('replaces the default Astro page with the Korean MVP landing page', () => {
    const html = readFileSync(homeHtmlPath, 'utf8');

    expect(html).toContain('lang="ko"');
    expect(html).toContain('<title>소상공인 무료 계산기와 체크리스트</title>');
    expect(html).toContain('rel="canonical" href="https://mqzkim.github.io/"');
    expect(html).toContain('property="og:title" content="소상공인 무료 계산기와 체크리스트"');
    expect(html).toContain('property="og:description" content="소상공인을 위한 무료 계산기와 체크리스트. 부가세, 마진율, 인건비 계산과 견적서·랜딩 문구 점검을 빠르게 시작하세요."');
    expect(html).toContain('property="og:url" content="https://mqzkim.github.io/"');
    expect(html).toContain('property="og:type" content="website"');
    expect(html).toContain('name="twitter:card" content="summary"');
    expect(html).toMatch(/<h1\b[^>]*>소상공인을 위한 무료 계산기와 체크리스트<\/h1>/);
    expect(html).toContain('부가세, 마진율, 인건비처럼 자주 확인하는 숫자를 빠르게 계산하고 견적·랜딩 문구 체크리스트로 누락을 줄입니다.');
    expect(html).toContain('href="/tools/vat-calculator"');
    expect(html).toContain('부가세 계산기 바로 쓰기');
    expect(html).toContain('href="/tools/margin-calculator"');
    expect(html).toContain('마진율 계산기 바로 쓰기');
    expect(html).toContain('href="/tools/wage-converter"');
    expect(html).toContain('인건비 계산기 바로 쓰기');
    expect(html).toContain('견적서 체크리스트 바로 쓰기');
    expect(html).toContain('랜딩 문구 체크리스트 바로 쓰기');
    expect(html).toContain('사용 가능/준비 중인 도구');
    expect(html).toContain('type="application/ld+json"');
    expect(html).toContain('"@type":"WebSite"');
    expect(html).toContain('"url":"https://mqzkim.github.io/"');
    expect(html).toContain('"publisher":{"@type":"Organization","name":"사업자 도구 모음"}');
    expect(html).toContain('"inLanguage":"ko-KR"');
    expect(html).toContain('"@type":"ItemList"');
    expect(html).toContain('"numberOfItems":5');
    expect(html).toContain('"url":"/tools/vat-calculator"');
    expect(html).toContain('"url":"/checklists/landing-copy-checklist"');
    expect(html).toContain('id="home-faq"');
    expect(html).toContain('자주 묻는 질문');
    expect(html).toContain('계산 결과를 저장하나요?');
    expect(html).toContain('입력한 값은 브라우저 화면에서만 계산하며 서버에 저장하지 않습니다.');
    expect(html).toContain('"@type":"FAQPage"');
    expect(html).toContain('"@type":"Question"');
    expect(html).toContain('"acceptedAnswer"');
    expect(html).toMatch(/<span\b[^>]*class="badge"[^>]*>사용 가능<\/span>[\s\S]*?마진율·원가·판매가 계산기/);
    expect(html).toMatch(/<span\b[^>]*class="badge"[^>]*>사용 가능<\/span>[\s\S]*?인건비\/시급\/월급 환산 계산기/);
    expect(html).toMatch(/<span\b[^>]*class="badge"[^>]*>사용 가능<\/span>[\s\S]*?견적서 항목 체크리스트/);
    expect(html).toMatch(/<span\b[^>]*class="badge"[^>]*>사용 가능<\/span>[\s\S]*?사업자용 랜딩 문구 템플릿 체크리스트/);
    expect(html).toContain('마진율·원가·판매가 계산기');
    expect(html).toContain('인건비/시급/월급 환산 계산기');
    expect(html).toContain('견적서 항목 체크리스트');
    expect(html).toContain('사업자용 랜딩 문구 템플릿 체크리스트');
    expect(html).toContain('참고용 도구이며 세무·노무·법률 판단은 전문가 확인이 필요합니다.');
  });
});

describe('built VAT calculator static HTML', () => {
  it('contains the core accessible MVP elements and internal links', () => {
    const html = readFileSync(vatHtmlPath, 'utf8');

    expect(html).toMatch(/<h1\b[^>]*>부가세 포함\/제외 계산기<\/h1>/);
    expect(html).toContain('이 계산기는 빠른 확인을 위한 참고용 도구입니다.');
    expect(html).toContain('id="vat-amount"');
    expect(html).toContain('id="vat-rate"');
    expect(html).toContain('id="vat-rounding"');
    expect(html).toContain('id="vat-result"');
    expect(html).toContain('aria-labelledby="vat-result-title"');
    expect(html).toContain('data-result="supplyAmount"');
    expect(html).toContain('data-result="vatAmount"');
    expect(html).toContain('data-result="totalAmount"');
    expect(html).toContain('id="vat-copy"');
    expect(html).toContain('aria-describedby="vat-copy-status"');
    expect(html).toContain('href="/tools/margin-calculator"');
    expect(html).toContain('href="/checklists/quote-checklist"');
  });
});

describe('built margin calculator static HTML', () => {
  it('replaces the preparation page with a launchable calculator page', () => {
    const html = readFileSync(marginHtmlPath, 'utf8');

    expect(html).toContain('lang="ko"');
    expect(html).toContain('<title>마진율 계산기 | 원가·수수료·배송비 반영 순이익 계산</title>');
    expect(html).toMatch(/<h1\b[^>]*>마진율·원가·판매가 계산기<\/h1>/);
    expect(html).toContain('판매가에서 실제 남는 금액을 10초 안에 확인하세요.');
    expect(html).toContain('id="margin-selling-price"');
    expect(html).toContain('id="margin-product-cost"');
    expect(html).toContain('id="margin-fee-percent"');
    expect(html).toContain('id="margin-shipping-cost"');
    expect(html).toContain('id="margin-extra-cost"');
    expect(html).toContain('id="margin-calculate"');
    expect(html).toContain('id="margin-error"');
    expect(html).toContain('role="alert"');
    expect(html).toContain('id="margin-input-help"');
    expect(html).toContain('aria-describedby="margin-input-help"');
    expect(html).toContain('id="margin-result"');
    expect(html).toContain('aria-labelledby="margin-result-title"');
    expect(html).toContain('data-result="profitAmount"');
    expect(html).toContain('data-result="marginRatePercent"');
    expect(html).toContain('data-result="breakEvenPrice"');
    expect(html).toContain('12,950원');
    expect(html).toContain('43.17%');
    expect(html).toContain('16,581원');
    expect(html).toContain('id="margin-copy"');
    expect(html).toContain('aria-describedby="margin-copy-help margin-copy-status"');
    expect(html).toContain('id="margin-copy-help"');
    expect(html).toContain('복사가 막히면 결과 문구를 직접 선택해 복사할 수 있습니다.');
    expect(html).toMatch(/<script[^>]+type="module"[^>]+src="\/_astro\/margin-calculator\.astro_astro_type_script_index_0_lang\.[^"]+\.js"/);
    expect(html).toContain('href="/tools/vat-calculator"');
    expect(html).toContain('href="/checklists/quote-checklist"');
    expect(html).toContain('이 계산기는 빠른 확인을 위한 참고용 도구입니다.');
  });
});

describe('built wage converter static HTML', () => {
  it('replaces the preparation page with a launchable wage converter page', () => {
    const html = readFileSync(wageHtmlPath, 'utf8');

    expect(html).toContain('lang="ko"');
    expect(html).toContain('<title>인건비 계산기 | 시급·일급·주급·월급 환산</title>');
    expect(html).toMatch(/<h1\b[^>]*>인건비\/시급\/월급 환산 계산기<\/h1>/);
    expect(html).toContain('시급과 근무 패턴으로 월 인건비를 빠르게 확인하세요.');
    expect(html).toContain('id="wage-hourly-wage"');
    expect(html).toContain('id="wage-daily-hours"');
    expect(html).toContain('id="wage-weekly-work-days"');
    expect(html).toContain('id="wage-monthly-work-days"');
    expect(html).toContain('id="wage-monthly-salary"');
    expect(html).toContain('id="wage-calculate"');
    expect(html).toContain('id="wage-error"');
    expect(html).toContain('role="alert"');
    expect(html).toContain('id="wage-input-help"');
    expect(html).toContain('aria-describedby="wage-input-help"');
    expect(html).toContain('id="wage-result"');
    expect(html).toContain('aria-labelledby="wage-result-title"');
    expect(html).toContain('data-result="dailyPay"');
    expect(html).toContain('data-result="weeklyPay"');
    expect(html).toContain('data-result="monthlyPay"');
    expect(html).toContain('data-result="effectiveHourlyWage"');
    expect(html).toContain('72,000원');
    expect(html).toContain('360,000원');
    expect(html).toContain('1,584,000원');
    expect(html).toContain('id="wage-copy"');
    expect(html).toContain('aria-describedby="wage-copy-help wage-copy-status"');
    expect(html).toContain('id="wage-copy-help"');
    expect(html).toContain('복사가 막히면 결과 문구를 직접 선택해 복사할 수 있습니다.');
    expect(html).toMatch(/<script[^>]+type="module"[^>]+src="\/_astro\/wage-converter\.astro_astro_type_script_index_0_lang\.[^"]+\.js"/);
    expect(html).toContain('href="/tools/vat-calculator"');
    expect(html).toContain('href="/tools/margin-calculator"');
    expect(html).toContain('참고용 도구이며 노무·세무·법률 판단은 전문가 확인이 필요합니다.');
  });
});

describe('built quote checklist static HTML', () => {
  it('replaces the preparation page with a launchable quote checklist', () => {
    const html = readFileSync(quoteHtmlPath, 'utf8');

    expect(html).toContain('lang="ko"');
    expect(html).toContain('<title>견적서 체크리스트 | 금액·범위·납기 제출 전 점검</title>');
    expect(html).toMatch(/<h1\b[^>]*>견적서 항목 체크리스트<\/h1>/);
    expect(html).toContain('견적서를 보내기 전 3분 안에 빠진 조건을 확인하세요.');
    expect(html).toContain('id="quote-checklist"');
    expect(html).toContain('id="quote-scope"');
    expect(html).toContain('id="quote-price"');
    expect(html).toContain('id="quote-schedule"');
    expect(html).toContain('id="quote-payment"');
    expect(html).toContain('id="quote-revision"');
    expect(html).toContain('id="quote-copy-template"');
    expect(html).toContain('복사해서 견적서 메모에 붙여넣기');
    expect(html).toContain('작업 범위와 제외 범위를 함께 적었나요?');
    expect(html).toContain('부가세 포함/별도 여부를 표시했나요?');
    expect(html).toContain('href="/tools/vat-calculator"');
    expect(html).toContain('href="/tools/margin-calculator"');
    expect(html).toContain('href="/tools/wage-converter"');
    expect(html).toContain('참고용 체크리스트이며 계약·세무·법률 판단은 전문가 확인이 필요합니다.');
  });
});

describe('built landing copy checklist static HTML', () => {
  it('replaces the preparation page with a launchable landing copy checklist', () => {
    const html = readFileSync(landingCopyHtmlPath, 'utf8');

    expect(html).toContain('lang="ko"');
    expect(html).toContain('<title>랜딩 문구 체크리스트 | 가치제안·혜택·CTA 점검</title>');
    expect(html).toMatch(/<h1\b[^>]*>사업자용 랜딩 문구 템플릿 체크리스트<\/h1>/);
    expect(html).toContain('랜딩 페이지를 공개하기 전 5분 안에 핵심 문구 누락을 확인하세요.');
    expect(html).toContain('id="landing-copy-checklist"');
    expect(html).toContain('id="landing-copy-value"');
    expect(html).toContain('id="landing-copy-benefits"');
    expect(html).toContain('id="landing-copy-proof"');
    expect(html).toContain('id="landing-copy-cta"');
    expect(html).toContain('id="landing-copy-risk"');
    expect(html).toContain('id="landing-copy-template"');
    expect(html).toContain('복사해서 랜딩 초안 점검에 붙여넣기');
    expect(html).toContain('첫 화면에서 누구를 위한 상품인지 1문장으로 말했나요?');
    expect(html).toContain('CTA 버튼 문구가 사용자의 다음 행동을 동사로 말하나요?');
    expect(html).toContain('href="/tools/vat-calculator"');
    expect(html).toContain('href="/tools/margin-calculator"');
    expect(html).toContain('href="/checklists/quote-checklist"');
    expect(html).toContain('참고용 체크리스트이며 광고 성과·법률 문구·업종별 표시 의무 판단은 전문가 확인이 필요합니다.');
  });
});

describe('individual page social metadata', () => {
  const pages = [
    { path: vatHtmlPath, title: '부가세 계산기 | 공급가액·세액·총액 빠른 계산', url: 'https://mqzkim.github.io/tools/vat-calculator/', schemaType: 'WebApplication' },
    { path: marginHtmlPath, title: '마진율 계산기 | 원가·수수료·배송비 반영 순이익 계산', url: 'https://mqzkim.github.io/tools/margin-calculator/', schemaType: 'WebApplication' },
    { path: wageHtmlPath, title: '인건비 계산기 | 시급·일급·주급·월급 환산', url: 'https://mqzkim.github.io/tools/wage-converter/', schemaType: 'WebApplication' },
    { path: quoteHtmlPath, title: '견적서 체크리스트 | 금액·범위·납기 제출 전 점검', url: 'https://mqzkim.github.io/checklists/quote-checklist/', schemaType: 'CreativeWork' },
    { path: landingCopyHtmlPath, title: '랜딩 문구 체크리스트 | 가치제안·혜택·CTA 점검', url: 'https://mqzkim.github.io/checklists/landing-copy-checklist/', schemaType: 'CreativeWork' },
  ];

  it('publishes OG, Twitter, canonical, and JSON-LD metadata for every launched detail page', () => {
    for (const page of pages) {
      const html = readFileSync(page.path, 'utf8');

      expect(html).toContain(`rel="canonical" href="${page.url}"`);
      expect(html).toContain(`property="og:title" content="${page.title}"`);
      expect(html).toContain(`property="og:url" content="${page.url}"`);
      expect(html).toContain('property="og:description"');
      expect(html).toContain('name="twitter:card" content="summary"');
      expect(html).toContain('name="twitter:title"');
      expect(html).toContain('name="twitter:description"');
      expect(html).toContain('type="application/ld+json"');
      expect(html).toContain(`"@type":"${page.schemaType}"`);
      expect(html).toContain(`"url":"${page.url}"`);
      expect(html).toContain('"inLanguage":"ko-KR"');
      expect(html).toContain('"isAccessibleForFree":true');
    }
  });
});

describe('SEO discovery files', () => {
  it('publishes a sitemap and robots.txt with every launchable local route', () => {
    const sitemap = readFileSync(sitemapXmlPath, 'utf8');
    const robots = readFileSync(robotsTxtPath, 'utf8');

    expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(sitemap).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(sitemap).toContain('<loc>https://mqzkim.github.io/</loc>');
    expect(sitemap).toContain('<loc>https://mqzkim.github.io/tools/vat-calculator/</loc>');
    expect(sitemap).toContain('<loc>https://mqzkim.github.io/tools/margin-calculator/</loc>');
    expect(sitemap).toContain('<loc>https://mqzkim.github.io/tools/wage-converter/</loc>');
    expect(sitemap).toContain('<loc>https://mqzkim.github.io/checklists/quote-checklist/</loc>');
    expect(sitemap).toContain('<loc>https://mqzkim.github.io/checklists/landing-copy-checklist/</loc>');
    expect(sitemap).toContain('<changefreq>weekly</changefreq>');
    expect(sitemap).toContain('<priority>1.0</priority>');

    expect(robots).toContain('User-agent: *');
    expect(robots).toContain('Allow: /');
    expect(robots).toContain('Sitemap: https://mqzkim.github.io/sitemap.xml');
  });
});
