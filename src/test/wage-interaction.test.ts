import { describe, expect, it } from 'vitest';
import { buildWageViewModel, parseWageInput } from '../lib/wage-interaction';

describe('wage converter interaction helper', () => {
  it('parses comma-formatted raw inputs and treats blank monthly salary as optional', () => {
    expect(
      parseWageInput({
        hourlyWage: '12,000',
        dailyHours: '6',
        weeklyWorkDays: '5',
        monthlyWorkDays: '22',
        monthlySalary: '',
      }),
    ).toEqual({
      hourlyWage: 12_000,
      dailyHours: 6,
      weeklyWorkDays: 5,
      monthlyWorkDays: 22,
      monthlySalary: undefined,
    });
  });

  it('builds Korean display strings for the live result panel', () => {
    expect(
      buildWageViewModel({
        hourlyWage: '12,000',
        dailyHours: '6',
        weeklyWorkDays: '5',
        monthlyWorkDays: '22',
        monthlySalary: '',
      }),
    ).toEqual({
      dailyPay: '72,000원',
      weeklyPay: '360,000원',
      monthlyPay: '1,584,000원',
      yearlyPay: '19,008,000원',
      weeklyHours: '30시간',
      monthlyHours: '132시간',
      effectiveHourlyWage: '12,000원',
      formulaText: '12,000원 × 6시간 × 월 22일 = 1,584,000원',
      copyText: '시급 12,000원 / 일급 72,000원 / 주급 360,000원 / 월 환산 1,584,000원',
    });
  });

  it('uses optional monthly salary to display effective hourly wage', () => {
    expect(
      buildWageViewModel({
        hourlyWage: '12,000',
        dailyHours: '8',
        weeklyWorkDays: '5',
        monthlyWorkDays: '22',
        monthlySalary: '2,200,000',
      }).effectiveHourlyWage,
    ).toBe('12,500원');
  });

  it('throws a Korean required-input error before calculation validation', () => {
    expect(() =>
      parseWageInput({
        hourlyWage: '',
        dailyHours: '6',
        weeklyWorkDays: '5',
        monthlyWorkDays: '22',
        monthlySalary: '',
      }),
    ).toThrow('시급을 입력해 주세요.');
  });
});
