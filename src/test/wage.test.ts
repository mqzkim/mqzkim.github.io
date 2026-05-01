import { describe, expect, it } from 'vitest';
import { calculateWageConversion } from '../lib/wage';

const cases = [
  {
    name: '시급과 근무 패턴으로 일급·주급·월급을 환산한다',
    input: { hourlyWage: 12_000, dailyHours: 6, weeklyWorkDays: 5, monthlyWorkDays: 22 },
    expected: {
      dailyPay: 72_000,
      weeklyPay: 360_000,
      monthlyPay: 1_584_000,
      yearlyPay: 19_008_000,
      weeklyHours: 30,
      monthlyHours: 132,
      effectiveHourlyWage: 12_000,
    },
  },
  {
    name: '소수 근무시간은 원 단위로 반올림한다',
    input: { hourlyWage: 10_030, dailyHours: 7.5, weeklyWorkDays: 5, monthlyWorkDays: 21 },
    expected: {
      dailyPay: 75_225,
      weeklyPay: 376_125,
      monthlyPay: 1_579_725,
      yearlyPay: 18_956_700,
      weeklyHours: 37.5,
      monthlyHours: 157.5,
      effectiveHourlyWage: 10_030,
    },
  },
  {
    name: '주 3일 파트타임 패턴을 계산한다',
    input: { hourlyWage: 15_000, dailyHours: 4, weeklyWorkDays: 3, monthlyWorkDays: 13 },
    expected: {
      dailyPay: 60_000,
      weeklyPay: 180_000,
      monthlyPay: 780_000,
      yearlyPay: 9_360_000,
      weeklyHours: 12,
      monthlyHours: 52,
      effectiveHourlyWage: 15_000,
    },
  },
  {
    name: '월급을 함께 입력하면 실질 시급을 역산한다',
    input: { hourlyWage: 12_000, dailyHours: 8, weeklyWorkDays: 5, monthlyWorkDays: 22, monthlySalary: 2_200_000 },
    expected: {
      dailyPay: 96_000,
      weeklyPay: 480_000,
      monthlyPay: 2_112_000,
      yearlyPay: 25_344_000,
      weeklyHours: 40,
      monthlyHours: 176,
      effectiveHourlyWage: 12_500,
    },
  },
  {
    name: '반나절 월급 역산도 계산한다',
    input: { hourlyWage: 20_000, dailyHours: 3.5, weeklyWorkDays: 4, monthlyWorkDays: 18, monthlySalary: 1_300_000 },
    expected: {
      dailyPay: 70_000,
      weeklyPay: 280_000,
      monthlyPay: 1_260_000,
      yearlyPay: 15_120_000,
      weeklyHours: 14,
      monthlyHours: 63,
      effectiveHourlyWage: 20_635,
    },
  },
] as const;

describe('calculateWageConversion', () => {
  it.each(cases)('$name', ({ input, expected }) => {
    expect(calculateWageConversion(input)).toMatchObject(expected);
  });

  it('계산식과 복사용 텍스트를 한국어로 만든다', () => {
    expect(calculateWageConversion({ hourlyWage: 12_000, dailyHours: 6, weeklyWorkDays: 5, monthlyWorkDays: 22 })).toMatchObject({
      formulaText: '12,000원 × 6시간 × 월 22일 = 1,584,000원',
      copyText: '시급 12,000원 / 일급 72,000원 / 주급 360,000원 / 월 환산 1,584,000원',
    });
  });

  it('잘못된 입력은 명확한 오류를 던진다', () => {
    expect(() => calculateWageConversion({ hourlyWage: 0, dailyHours: 6, weeklyWorkDays: 5, monthlyWorkDays: 22 })).toThrow(
      '시급은 0원보다 커야 합니다.',
    );
    expect(() => calculateWageConversion({ hourlyWage: 12_000, dailyHours: 0, weeklyWorkDays: 5, monthlyWorkDays: 22 })).toThrow(
      '일 근무시간은 0시간보다 커야 합니다.',
    );
    expect(() => calculateWageConversion({ hourlyWage: 12_000, dailyHours: 6, weeklyWorkDays: 8, monthlyWorkDays: 22 })).toThrow(
      '주 근무일은 7일 이하로 입력해 주세요.',
    );
    expect(() => calculateWageConversion({ hourlyWage: 12_000, dailyHours: 6, weeklyWorkDays: 5, monthlyWorkDays: 0 })).toThrow(
      '월 근무일은 0일보다 커야 합니다.',
    );
  });
});
