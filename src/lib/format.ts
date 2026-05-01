export function formatKRW(value: number): string {
  if (!Number.isFinite(value)) {
    throw new Error('숫자만 입력해 주세요.');
  }

  return `${Math.trunc(value).toLocaleString('ko-KR')}원`;
}
