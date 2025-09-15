/**
 * 읽기 시간 계산 유틸리티
 */

/**
 * 텍스트의 읽기 시간을 계산합니다 (분 단위)
 * @param content - 계산할 텍스트 내용
 * @returns 읽기 시간 (분)
 */
export function calculateReadingTime(content: string): number {
  // HTML 태그 제거
  const cleanContent = content.replace(/<[^>]*>/g, '');

  // 한국어 기준: 분당 200단어 또는 1000글자
  const wordsPerMinute = 100;
  const charsPerMinute = 500;

  // 단어 수 계산 (공백으로 분리)
  const wordCount = cleanContent
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  // 글자 수 계산 (공백 제외)
  const charCount = cleanContent.replace(/\s/g, '').length;

  // 두 방법 중 더 정확한 것 선택
  const readingTimeByWords = Math.ceil(wordCount / wordsPerMinute);
  const readingTimeByChars = Math.ceil(charCount / charsPerMinute);

  // 최소 1분, 최대 30분으로 제한
  const readingTime = Math.min(
    Math.max(Math.max(readingTimeByWords, readingTimeByChars), 1),
    30
  );

  return readingTime;
}

/**
 * 읽기 시간을 포맷팅합니다
 * @param minutes - 읽기 시간 (분)
 * @returns 포맷팅된 읽기 시간 문자열
 */
export function formatReadingTime(minutes: number): string {
  if (minutes < 1) {
    return '1분 미만';
  }
  return `${minutes}분 읽기`;
}
