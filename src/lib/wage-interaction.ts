import { formatKRW } from './format';
import { calculateWageConversion, type WageConversionInput } from './wage';

export type RawWageInput = {
  hourlyWage: string;
  dailyHours: string;
  weeklyWorkDays: string;
  monthlyWorkDays: string;
  monthlySalary: string;
};

export type WageViewModel = {
  dailyPay: string;
  weeklyPay: string;
  monthlyPay: string;
  yearlyPay: string;
  weeklyHours: string;
  monthlyHours: string;
  effectiveHourlyWage: string;
  formulaText: string;
  copyText: string;
};

function parseRawNumber(value: string, fieldLabel: string, required: boolean): number | undefined {
  const normalized = value.replaceAll(',', '').trim();

  if (normalized === '') {
    if (required) {
      throw new Error(`${fieldLabel}을 입력해 주세요.`);
    }

    return undefined;
  }

  return Number(normalized);
}

function formatHours(value: number): string {
  return `${value.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}시간`;
}

export function parseWageInput(raw: RawWageInput): WageConversionInput {
  return {
    hourlyWage: parseRawNumber(raw.hourlyWage, '시급', true) ?? 0,
    dailyHours: parseRawNumber(raw.dailyHours, '일 근무시간', true) ?? 0,
    weeklyWorkDays: parseRawNumber(raw.weeklyWorkDays, '주 근무일', true) ?? 0,
    monthlyWorkDays: parseRawNumber(raw.monthlyWorkDays, '월 근무일', true) ?? 0,
    monthlySalary: parseRawNumber(raw.monthlySalary, '월급', false),
  };
}

export function buildWageViewModel(raw: RawWageInput): WageViewModel {
  const result = calculateWageConversion(parseWageInput(raw));

  return {
    dailyPay: formatKRW(result.dailyPay),
    weeklyPay: formatKRW(result.weeklyPay),
    monthlyPay: formatKRW(result.monthlyPay),
    yearlyPay: formatKRW(result.yearlyPay),
    weeklyHours: formatHours(result.weeklyHours),
    monthlyHours: formatHours(result.monthlyHours),
    effectiveHourlyWage: formatKRW(result.effectiveHourlyWage),
    formulaText: result.formulaText,
    copyText: result.copyText,
  };
}
