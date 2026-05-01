import { formatKRW } from './format';

export type VatMode = 'exclusive_to_total' | 'inclusive_to_supply';
export type RoundingMode = 'round' | 'floor' | 'ceil';

export type VatInput = {
  mode: VatMode;
  amount: number;
  ratePercent: number;
  rounding: RoundingMode;
};

export type VatResult = {
  supplyAmount: number;
  vatAmount: number;
  totalAmount: number;
  ratePercent: number;
  formulaText: string;
  copyText: string;
};

const MAX_AMOUNT = 999_999_999_999;

export function applyRounding(value: number, rounding: RoundingMode): number {
  if (rounding === 'floor') return Math.floor(value);
  if (rounding === 'ceil') return Math.ceil(value);
  return Math.round(value);
}

export function validateVatInput(input: VatInput): void {
  if (!['exclusive_to_total', 'inclusive_to_supply'].includes(input.mode)) {
    throw new Error('계산 모드를 선택해 주세요.');
  }

  if (!['round', 'floor', 'ceil'].includes(input.rounding)) {
    throw new Error('반올림 방식을 선택해 주세요.');
  }

  if (!Number.isFinite(input.amount) || !Number.isFinite(input.ratePercent)) {
    throw new Error('숫자만 입력해 주세요.');
  }

  if (input.amount < 0) {
    throw new Error('0원 이상의 금액을 입력해 주세요.');
  }

  if (input.amount > MAX_AMOUNT) {
    throw new Error('계산 가능한 최대 금액은 999,999,999,999원입니다.');
  }

  if (input.ratePercent < 0) {
    throw new Error('0% 이상의 세율을 입력해 주세요.');
  }

  if (input.ratePercent > 100) {
    throw new Error('100% 이하의 세율을 입력해 주세요.');
  }
}

export function calculateVat(input: VatInput): VatResult {
  validateVatInput(input);

  const rate = input.ratePercent / 100;
  let supplyAmount: number;
  let vatAmount: number;
  let totalAmount: number;
  let formulaText: string;

  if (input.mode === 'exclusive_to_total') {
    supplyAmount = input.amount;
    vatAmount = applyRounding(supplyAmount * rate, input.rounding);
    totalAmount = supplyAmount + vatAmount;
    formulaText = `${formatKRW(supplyAmount)} × ${input.ratePercent}% = ${formatKRW(vatAmount)}`;
  } else {
    totalAmount = input.amount;
    supplyAmount = applyRounding(totalAmount / (1 + rate), input.rounding);
    vatAmount = totalAmount - supplyAmount;
    formulaText = `${formatKRW(totalAmount)} ÷ (1 + ${input.ratePercent}%) = ${formatKRW(supplyAmount)}`;
  }

  return {
    supplyAmount,
    vatAmount,
    totalAmount,
    ratePercent: input.ratePercent,
    formulaText,
    copyText: `공급가액 ${formatKRW(supplyAmount)} / 부가세 ${formatKRW(vatAmount)} / 총액 ${formatKRW(totalAmount)}`,
  };
}
