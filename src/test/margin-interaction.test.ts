import { describe, expect, it } from 'vitest';
import { buildMarginViewModel, parseMarginInput } from '../lib/margin-interaction';

describe('margin calculator interaction helper', () => {
  it('parses raw form strings with commas into calculation input', () => {
    expect(
      parseMarginInput({
        sellingPrice: '30,000',
        productCost: '12,000',
        feePercent: '3.5',
        shippingCost: '3,000',
        extraCost: '1,000',
      }),
    ).toEqual({
      sellingPrice: 30_000,
      productCost: 12_000,
      feePercent: 3.5,
      shippingCost: 3_000,
      extraCost: 1_000,
    });
  });

  it('treats blank optional cost fields as zero while keeping required-field errors explicit', () => {
    expect(
      parseMarginInput({
        sellingPrice: '10,000',
        productCost: '7,000',
        feePercent: '0',
        shippingCost: '',
        extraCost: '   ',
      }),
    ).toEqual({
      sellingPrice: 10_000,
      productCost: 7_000,
      feePercent: 0,
      shippingCost: 0,
      extraCost: 0,
    });

    expect(() =>
      parseMarginInput({
        sellingPrice: '',
        productCost: '7,000',
        feePercent: '0',
        shippingCost: '',
        extraCost: '',
      }),
    ).toThrow('판매가를 입력해 주세요.');
  });

  it('builds Korean display text and copy text from raw inputs', () => {
    expect(
      buildMarginViewModel({
        sellingPrice: '30,000',
        productCost: '12,000',
        feePercent: '3.5',
        shippingCost: '3,000',
        extraCost: '1,000',
      }),
    ).toMatchObject({
      feeAmount: '1,050원',
      totalCost: '17,050원',
      profitAmount: '12,950원',
      marginRatePercent: '43.17%',
      markupRatePercent: '107.92%',
      breakEvenPrice: '16,581원',
      formulaText: '30,000원 - 17,050원 = 12,950원',
      copyText: '판매가 30,000원 / 총비용 17,050원 / 이익 12,950원 / 마진율 43.17%',
    });
  });

  it('returns calculation validation errors as Korean messages', () => {
    expect(() =>
      buildMarginViewModel({
        sellingPrice: '0',
        productCost: '12,000',
        feePercent: '3.5',
        shippingCost: '3,000',
        extraCost: '1,000',
      }),
    ).toThrow('판매가는 0원보다 커야 합니다.');
  });
});
