import { formatKRW } from './format';

export type MarginInput = {
  sellingPrice: number;
  productCost: number;
  feePercent: number;
  shippingCost: number;
  extraCost: number;
};

export type MarginResult = {
  feeAmount: number;
  totalCost: number;
  profitAmount: number;
  marginRatePercent: number;
  markupRatePercent: number | null;
  breakEvenPrice: number;
  formulaText: string;
  copyText: string;
};

const MAX_AMOUNT = 999_999_999_999;

function roundPercent(value: number): number {
  return Math.round(value * 100) / 100;
}

function formatPercent(value: number): string {
  return `${value.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}%`;
}

export function validateMarginInput(input: MarginInput): void {
  if (!Number.isFinite(input.sellingPrice)) {
    throw new Error('판매가는 숫자로 입력해 주세요.');
  }

  if (input.sellingPrice <= 0) {
    throw new Error('판매가는 0원보다 커야 합니다.');
  }

  if (input.sellingPrice > MAX_AMOUNT) {
    throw new Error('계산 가능한 최대 금액은 999,999,999,999원입니다.');
  }

  for (const cost of [input.productCost, input.shippingCost, input.extraCost]) {
    if (!Number.isFinite(cost)) {
      throw new Error('비용은 숫자로 입력해 주세요.');
    }

    if (cost < 0) {
      throw new Error('비용은 0원 이상으로 입력해 주세요.');
    }

    if (cost > MAX_AMOUNT) {
      throw new Error('계산 가능한 최대 금액은 999,999,999,999원입니다.');
    }
  }

  if (!Number.isFinite(input.feePercent)) {
    throw new Error('수수료율은 숫자로 입력해 주세요.');
  }

  if (input.feePercent < 0) {
    throw new Error('수수료율은 0% 이상으로 입력해 주세요.');
  }

  if (input.feePercent >= 99) {
    throw new Error('수수료율은 99% 미만으로 입력해 주세요.');
  }
}

export function calculateMargin(input: MarginInput): MarginResult {
  validateMarginInput(input);

  const feeRate = input.feePercent / 100;
  const feeAmount = Math.round(input.sellingPrice * feeRate);
  const totalCost = input.productCost + feeAmount + input.shippingCost + input.extraCost;
  const profitAmount = input.sellingPrice - totalCost;
  const marginRatePercent = roundPercent((profitAmount / input.sellingPrice) * 100);
  const markupRatePercent = input.productCost === 0 ? null : roundPercent((profitAmount / input.productCost) * 100);
  const breakEvenPrice = Math.ceil((input.productCost + input.shippingCost + input.extraCost) / (1 - feeRate));

  return {
    feeAmount,
    totalCost,
    profitAmount,
    marginRatePercent,
    markupRatePercent,
    breakEvenPrice,
    formulaText: `${formatKRW(input.sellingPrice)} - ${formatKRW(totalCost)} = ${formatKRW(profitAmount)}`,
    copyText: `판매가 ${formatKRW(input.sellingPrice)} / 총비용 ${formatKRW(totalCost)} / 이익 ${formatKRW(profitAmount)} / 마진율 ${formatPercent(marginRatePercent)}`,
  };
}
