import { formatKRW } from './format';

export type WageConversionInput = {
  hourlyWage: number;
  dailyHours: number;
  weeklyWorkDays: number;
  monthlyWorkDays: number;
  monthlySalary?: number;
};

export type WageConversionResult = {
  dailyPay: number;
  weeklyPay: number;
  monthlyPay: number;
  yearlyPay: number;
  weeklyHours: number;
  monthlyHours: number;
  effectiveHourlyWage: number;
  formulaText: string;
  copyText: string;
};

const MAX_AMOUNT = 999_999_999_999;
const MAX_DAILY_HOURS = 24;
const MAX_MONTHLY_WORK_DAYS = 31;

function roundKRW(value: number): number {
  return Math.round(value);
}

function validatePositiveNumber(value: number, message: string): void {
  if (!Number.isFinite(value)) {
    throw new Error(message.replace('0', '숫자'));
  }

  if (value <= 0) {
    throw new Error(message);
  }
}

export function validateWageConversionInput(input: WageConversionInput): void {
  validatePositiveNumber(input.hourlyWage, '시급은 0원보다 커야 합니다.');
  validatePositiveNumber(input.dailyHours, '일 근무시간은 0시간보다 커야 합니다.');
  validatePositiveNumber(input.weeklyWorkDays, '주 근무일은 0일보다 커야 합니다.');
  validatePositiveNumber(input.monthlyWorkDays, '월 근무일은 0일보다 커야 합니다.');

  if (input.hourlyWage > MAX_AMOUNT || (input.monthlySalary ?? 0) > MAX_AMOUNT) {
    throw new Error('계산 가능한 최대 금액은 999,999,999,999원입니다.');
  }

  if (input.dailyHours > MAX_DAILY_HOURS) {
    throw new Error('일 근무시간은 24시간 이하로 입력해 주세요.');
  }

  if (input.weeklyWorkDays > 7) {
    throw new Error('주 근무일은 7일 이하로 입력해 주세요.');
  }

  if (input.monthlyWorkDays > MAX_MONTHLY_WORK_DAYS) {
    throw new Error('월 근무일은 31일 이하로 입력해 주세요.');
  }

  if (input.monthlySalary !== undefined) {
    validatePositiveNumber(input.monthlySalary, '월급은 0원보다 커야 합니다.');
  }
}

export function calculateWageConversion(input: WageConversionInput): WageConversionResult {
  validateWageConversionInput(input);

  const weeklyHours = input.dailyHours * input.weeklyWorkDays;
  const monthlyHours = input.dailyHours * input.monthlyWorkDays;
  const dailyPay = roundKRW(input.hourlyWage * input.dailyHours);
  const weeklyPay = roundKRW(dailyPay * input.weeklyWorkDays);
  const monthlyPay = roundKRW(input.hourlyWage * monthlyHours);
  const yearlyPay = monthlyPay * 12;
  const effectiveHourlyWage = roundKRW((input.monthlySalary ?? monthlyPay) / monthlyHours);

  return {
    dailyPay,
    weeklyPay,
    monthlyPay,
    yearlyPay,
    weeklyHours,
    monthlyHours,
    effectiveHourlyWage,
    formulaText: `${formatKRW(input.hourlyWage)} × ${input.dailyHours.toLocaleString('ko-KR')}시간 × 월 ${input.monthlyWorkDays.toLocaleString('ko-KR')}일 = ${formatKRW(monthlyPay)}`,
    copyText: `시급 ${formatKRW(input.hourlyWage)} / 일급 ${formatKRW(dailyPay)} / 주급 ${formatKRW(weeklyPay)} / 월 환산 ${formatKRW(monthlyPay)}`,
  };
}
