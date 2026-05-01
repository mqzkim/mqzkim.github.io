import { formatKRW } from './format';
import { calculateMargin, type MarginInput } from './margin';

export type RawMarginInput = {
  sellingPrice: string;
  productCost: string;
  feePercent: string;
  shippingCost: string;
  extraCost: string;
};

export type MarginViewModel = {
  feeAmount: string;
  totalCost: string;
  profitAmount: string;
  marginRatePercent: string;
  markupRatePercent: string;
  breakEvenPrice: string;
  formulaText: string;
  copyText: string;
};

function parseRawNumber(value: string, fieldLabel: string, required: boolean): number {
  const normalized = value.replaceAll(',', '').trim();

  if (normalized === '') {
    if (required) {
      throw new Error(`${fieldLabel}를 입력해 주세요.`);
    }

    return 0;
  }

  return Number(normalized);
}

function formatPercent(value: number | null): string {
  return value === null
    ? '계산 제외'
    : `${value.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
}

export function parseMarginInput(raw: RawMarginInput): MarginInput {
  return {
    sellingPrice: parseRawNumber(raw.sellingPrice, '판매가', true),
    productCost: parseRawNumber(raw.productCost, '상품 원가', true),
    feePercent: parseRawNumber(raw.feePercent, '수수료율', true),
    shippingCost: parseRawNumber(raw.shippingCost, '배송·포장비', false),
    extraCost: parseRawNumber(raw.extraCost, '기타 비용', false),
  };
}

export function buildMarginViewModel(raw: RawMarginInput): MarginViewModel {
  const result = calculateMargin(parseMarginInput(raw));

  return {
    feeAmount: formatKRW(result.feeAmount),
    totalCost: formatKRW(result.totalCost),
    profitAmount: formatKRW(result.profitAmount),
    marginRatePercent: formatPercent(result.marginRatePercent),
    markupRatePercent: formatPercent(result.markupRatePercent),
    breakEvenPrice: formatKRW(result.breakEvenPrice),
    formulaText: result.formulaText,
    copyText: result.copyText,
  };
}
