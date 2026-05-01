import { describe, expect, it } from 'vitest';
import { calculateVat } from '../lib/vat';
import { buildVatViewModel, parseVatFormInput } from '../lib/vat-interaction';

const cases = [
  {
    name: '별도→포함 기본 케이스',
    input: { mode: 'exclusive_to_total', amount: 100_000, ratePercent: 10, rounding: 'round' },
    expected: { supplyAmount: 100_000, vatAmount: 10_000, totalAmount: 110_000 },
  },
  {
    name: '포함→공급가/세액 기본 역산',
    input: { mode: 'inclusive_to_supply', amount: 110_000, ratePercent: 10, rounding: 'round' },
    expected: { supplyAmount: 100_000, vatAmount: 10_000, totalAmount: 110_000 },
  },
  {
    name: '별도→포함 세액 반올림',
    input: { mode: 'exclusive_to_total', amount: 99_999, ratePercent: 10, rounding: 'round' },
    expected: { supplyAmount: 99_999, vatAmount: 10_000, totalAmount: 109_999 },
  },
  {
    name: '포함→공급가/세액 버림은 총액 일치를 우선한다',
    input: { mode: 'inclusive_to_supply', amount: 100_000, ratePercent: 10, rounding: 'floor' },
    expected: { supplyAmount: 90_909, vatAmount: 9_091, totalAmount: 100_000 },
  },
  {
    name: '포함→공급가/세액 올림은 총액 일치를 우선한다',
    input: { mode: 'inclusive_to_supply', amount: 100_000, ratePercent: 10, rounding: 'ceil' },
    expected: { supplyAmount: 90_910, vatAmount: 9_090, totalAmount: 100_000 },
  },
  {
    name: '별도→포함 큰 금액',
    input: { mode: 'exclusive_to_total', amount: 1_234_567, ratePercent: 10, rounding: 'round' },
    expected: { supplyAmount: 1_234_567, vatAmount: 123_457, totalAmount: 1_358_024 },
  },
  {
    name: '포함→공급가/세액 큰 금액 역산',
    input: { mode: 'inclusive_to_supply', amount: 1_234_567, ratePercent: 10, rounding: 'round' },
    expected: { supplyAmount: 1_122_334, vatAmount: 112_233, totalAmount: 1_234_567 },
  },
  {
    name: '별도→포함 0원 허용',
    input: { mode: 'exclusive_to_total', amount: 0, ratePercent: 10, rounding: 'round' },
    expected: { supplyAmount: 0, vatAmount: 0, totalAmount: 0 },
  },
  {
    name: '별도→포함 세율 0%',
    input: { mode: 'exclusive_to_total', amount: 100_000, ratePercent: 0, rounding: 'round' },
    expected: { supplyAmount: 100_000, vatAmount: 0, totalAmount: 100_000 },
  },
] as const;

describe('calculateVat', () => {
  it.each(cases)('$name', ({ input, expected }) => {
    expect(calculateVat(input)).toMatchObject(expected);
  });

  it('포함→공급가/세액 모드는 공급가액과 부가세액 합이 항상 총액과 같다', () => {
    for (const rounding of ['round', 'floor', 'ceil'] as const) {
      for (const amount of [1, 10_000, 100_000, 1_234_567, 999_999_999_999]) {
        const result = calculateVat({
          mode: 'inclusive_to_supply',
          amount,
          ratePercent: 10,
          rounding,
        });

        expect(result.supplyAmount + result.vatAmount).toBe(result.totalAmount);
      }
    }
  });

  it('잘못된 입력은 명확한 오류를 던진다', () => {
    expect(() => calculateVat({ mode: 'exclusive_to_total', amount: -1, ratePercent: 10, rounding: 'round' })).toThrow(
      '0원 이상의 금액을 입력해 주세요.',
    );
    expect(() => calculateVat({ mode: 'exclusive_to_total', amount: 1000, ratePercent: 101, rounding: 'round' })).toThrow(
      '100% 이하의 세율을 입력해 주세요.',
    );
    expect(() => calculateVat({ mode: 'exclusive_to_total', amount: Number.NaN, ratePercent: 10, rounding: 'round' })).toThrow(
      '숫자만 입력해 주세요.',
    );
  });
});

describe('vat interaction helpers', () => {
  it('폼 문자열 값을 계산 입력으로 변환한다', () => {
    expect(
      parseVatFormInput({
        mode: 'inclusive_to_supply',
        amount: '110,000',
        ratePercent: '10',
        rounding: 'floor',
      }),
    ).toEqual({
      mode: 'inclusive_to_supply',
      amount: 110_000,
      ratePercent: 10,
      rounding: 'floor',
    });
  });

  it('계산 결과를 화면 표시용 모델로 변환한다', () => {
    const result = calculateVat({ mode: 'exclusive_to_total', amount: 100_000, ratePercent: 10, rounding: 'round' });

    expect(buildVatViewModel(result)).toEqual({
      supplyAmountText: '100,000원',
      vatAmountText: '10,000원',
      totalAmountText: '110,000원',
      ratePercentText: '10%',
      formulaText: '100,000원 × 10% = 10,000원',
      copyText: '공급가액 100,000원 / 부가세 10,000원 / 총액 110,000원',
    });
  });
});
