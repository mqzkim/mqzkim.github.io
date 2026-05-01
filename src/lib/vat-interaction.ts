import { formatKRW } from './format';
import type { RoundingMode, VatInput, VatMode, VatResult } from './vat';

export type VatFormRawInput = {
  mode: string;
  amount: string;
  ratePercent: string;
  rounding: string;
};

export type VatViewModel = {
  supplyAmountText: string;
  vatAmountText: string;
  totalAmountText: string;
  ratePercentText: string;
  formulaText: string;
  copyText: string;
};

function normalizeNumericText(value: string): string {
  return value.replaceAll(',', '').trim();
}

function isVatMode(value: string): value is VatMode {
  return value === 'exclusive_to_total' || value === 'inclusive_to_supply';
}

function isRoundingMode(value: string): value is RoundingMode {
  return value === 'round' || value === 'floor' || value === 'ceil';
}

export function parseVatFormInput(raw: VatFormRawInput): VatInput {
  const amount = Number(normalizeNumericText(raw.amount));
  const ratePercent = Number(normalizeNumericText(raw.ratePercent));

  return {
    mode: isVatMode(raw.mode) ? raw.mode : 'exclusive_to_total',
    amount,
    ratePercent,
    rounding: isRoundingMode(raw.rounding) ? raw.rounding : 'round',
  };
}

export function buildVatViewModel(result: VatResult): VatViewModel {
  return {
    supplyAmountText: formatKRW(result.supplyAmount),
    vatAmountText: formatKRW(result.vatAmount),
    totalAmountText: formatKRW(result.totalAmount),
    ratePercentText: `${result.ratePercent}%`,
    formulaText: result.formulaText,
    copyText: result.copyText,
  };
}
