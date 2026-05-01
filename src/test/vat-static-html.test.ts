import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, beforeAll } from 'vitest';

const projectRoot = process.cwd();
const homeHtmlPath = join(projectRoot, 'dist/index.html');
const vatHtmlPath = join(projectRoot, 'dist/tools/vat-calculator/index.html');
const marginHtmlPath = join(projectRoot, 'dist/tools/margin-calculator/index.html');
const wageHtmlPath = join(projectRoot, 'dist/tools/wage-converter/index.html');
const placeholderPages = [
  {
    path: join(projectRoot, 'dist/checklists/quote-checklist/index.html'),
    sourcePath: join(projectRoot, 'src/pages/checklists/quote-checklist.astro'),
    h1: '견적서 항목 체크리스트',
    description: '견적 금액, 작업 범위, 납기, 수정 횟수, 결제 조건처럼 빠지기 쉬운 항목을 제출 전 점검하는 체크리스트를 준비하고 있습니다.',
  },
  {
    path: join(projectRoot, 'dist/checklists/landing-copy-checklist/index.html'),
    sourcePath: join(projectRoot, 'src/pages/checklists/landing-copy-checklist.astro'),
    h1: '사업자용 랜딩 문구 템플릿 체크리스트',
    description: '상품 소개, 고객 문제, 핵심 혜택, 신뢰 요소, CTA 문구가 랜딩 페이지에 빠지지 않았는지 점검하는 체크리스트를 준비하고 있습니다.'
  },
];

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
    expect(html).toMatch(/<h1\b[^>]*>소상공인을 위한 무료 계산기와 체크리스트<\/h1>/);
    expect(html).toContain('부가세, 마진율, 인건비처럼 자주 확인하는 숫자를 빠르게 계산하고 견적·랜딩 문구 체크리스트로 누락을 줄입니다.');
    expect(html).toContain('href="/tools/vat-calculator"');
    expect(html).toContain('부가세 계산기 바로 쓰기');
    expect(html).toContain('href="/tools/margin-calculator"');
    expect(html).toContain('마진율 계산기 바로 쓰기');
    expect(html).toContain('href="/tools/wage-converter"');
    expect(html).toContain('인건비 계산기 바로 쓰기');
    expect(html).toContain('사용 가능/준비 중인 도구');
    expect(html).toMatch(/<span\b[^>]*class="badge"[^>]*>사용 가능<\/span>[\s\S]*?마진율·원가·판매가 계산기/);
    expect(html).toMatch(/<span\b[^>]*class="badge"[^>]*>사용 가능<\/span>[\s\S]*?인건비\/시급\/월급 환산 계산기/);
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

describe('built placeholder static HTML', () => {
  it('creates Korean preparation pages for every homepage internal link', () => {
    for (const page of placeholderPages) {
      const html = readFileSync(page.path, 'utf8');

      expect(html).toContain('lang="ko"');
      expect(html).toMatch(/<span\b[^>]*class="badge"[^>]*>준비 중<\/span>/);
      expect(html).toMatch(new RegExp(`<h1\\b[^>]*>${page.h1}<\\/h1>`));
      expect(html).toContain(page.description);
      expect(html).toContain('href="/tools/vat-calculator"');
      expect(html).toContain('href="/"');
      expect(html).toContain('참고용 도구이며');
      expect(html).toContain('현재 페이지는 공개 전 로컬 MVP의 준비 중 화면입니다.');
    }
  });

  it('renders every preparation page through the shared ComingSoonPage component', () => {
    for (const page of placeholderPages) {
      const source = readFileSync(page.sourcePath, 'utf8');

      expect(source).toContain("import ComingSoonPage from '../../components/ComingSoonPage.astro';");
      expect(source).toContain('<ComingSoonPage');
      expect(source).not.toContain('<html lang="ko">');
      expect(source).not.toContain('<style>');
    }
  });
});
