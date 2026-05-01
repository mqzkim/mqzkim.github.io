import { describe, expect, it } from 'vitest';
import { calculateMargin } from '../lib/margin';

const cases = [
  {
    name: '기본 쇼핑몰 상품 마진을 계산한다',
    input: { sellingPrice: 30_000, productCost: 12_000, feePercent: 3.5, shippingCost: 3_000, extraCost: 1_000 },
    expected: {
      feeAmount: 1_050,
      totalCost: 17_050,
      profitAmount: 12_950,
      marginRatePercent: 43.17,
      markupRatePercent: 107.92,
      breakEvenPrice: 16_581,
    },
  },
  {
    name: '수수료와 배송비가 없는 단순 마진을 계산한다',
    input: { sellingPrice: 10_000, productCost: 7_000, feePercent: 0, shippingCost: 0, extraCost: 0 },
    expected: {
      feeAmount: 0,
      totalCost: 7_000,
      profitAmount: 3_000,
      marginRatePercent: 30,
      markupRatePercent: 42.86,
      breakEvenPrice: 7_000,
    },
  },
  {
    name: '소수 수수료율과 추가 비용을 반영한다',
    input: { sellingPrice: 55_000, productCost: 32_000, feePercent: 8.8, shippingCost: 3_500, extraCost: 2_500 },
    expected: {
      feeAmount: 4_840,
      totalCost: 42_840,
      profitAmount: 12_160,
      marginRatePercent: 22.11,
      markupRatePercent: 38,
      breakEvenPrice: 41_667,
    },
  },
  {
    name: '손해 구조도 음수 이익과 마진율로 표시한다',
    input: { sellingPrice: 15_000, productCost: 15_000, feePercent: 5, shippingCost: 0, extraCost: 0 },
    expected: {
      feeAmount: 750,
      totalCost: 15_750,
      profitAmount: -750,
      marginRatePercent: -5,
      markupRatePercent: -5,
      breakEvenPrice: 15_790,
    },
  },
  {
    name: '수수료액은 원 단위 반올림한다',
    input: { sellingPrice: 19_900, productCost: 8_500, feePercent: 2.9, shippingCost: 3_000, extraCost: 0 },
    expected: {
      feeAmount: 577,
      totalCost: 12_077,
      profitAmount: 7_823,
      marginRatePercent: 39.31,
      markupRatePercent: 92.04,
      breakEvenPrice: 11_844,
    },
  },
] as const;

describe('calculateMargin', () => {
  it.each(cases)('$name', ({ input, expected }) => {
    expect(calculateMargin(input)).toMatchObject(expected);
  });

  it('상품 원가가 0원이면 마크업률은 계산 제외한다', () => {
    expect(
      calculateMargin({ sellingPrice: 50_000, productCost: 0, feePercent: 3, shippingCost: 0, extraCost: 0 }).markupRatePercent,
    ).toBeNull();
  });

  it('계산식과 복사용 텍스트를 한국어로 만든다', () => {
    expect(calculateMargin({ sellingPrice: 30_000, productCost: 12_000, feePercent: 3.5, shippingCost: 3_000, extraCost: 1_000 })).toMatchObject({
      formulaText: '30,000원 - 17,050원 = 12,950원',
      copyText: '판매가 30,000원 / 총비용 17,050원 / 이익 12,950원 / 마진율 43.17%',
    });
  });

  it('잘못된 입력은 명확한 오류를 던진다', () => {
    expect(() => calculateMargin({ sellingPrice: 0, productCost: 1_000, feePercent: 3, shippingCost: 0, extraCost: 0 })).toThrow(
      '판매가는 0원보다 커야 합니다.',
    );
    expect(() => calculateMargin({ sellingPrice: 10_000, productCost: -1, feePercent: 3, shippingCost: 0, extraCost: 0 })).toThrow(
      '비용은 0원 이상으로 입력해 주세요.',
    );
    expect(() => calculateMargin({ sellingPrice: 10_000, productCost: 1_000, feePercent: 99, shippingCost: 0, extraCost: 0 })).toThrow(
      '수수료율은 99% 미만으로 입력해 주세요.',
    );
  });
});
