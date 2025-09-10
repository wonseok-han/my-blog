/**
 * 목차(Table of Contents) 생성 유틸리티
 * MDX 콘텐츠에서 제목들을 추출하여 목차를 생성합니다.
 */

export interface TOCItem {
  id: string;
  text: string;
  level: number;
  children?: TOCItem[];
}

/**
 * 제목 텍스트를 URL-safe ID로 변환
 * @param text 제목 텍스트
 * @returns URL-safe ID
 */
function generateId(text: string): string {
  // 한글, 영문, 숫자, 공백, 하이픈만 유지
  const cleaned = text
    .toLowerCase()
    .replace(/[^\u3131-\u3163\uac00-\ud7a3\w\s-]/g, '') // 한글, 영문, 숫자, 공백, 하이픈만 유지
    .replace(/\s+/g, '-') // 공백을 하이픈으로
    .replace(/-+/g, '-') // 연속된 하이픈을 하나로
    .replace(/^-+|-+$/g, '') // 앞뒤 하이픈 제거
    .trim();

  // 빈 문자열이면 기본 ID 생성
  return cleaned || 'heading';
}

/**
 * MDX 콘텐츠에서 제목들을 추출하여 목차 생성
 * @param content MDX 콘텐츠 문자열
 * @returns 목차 아이템 배열
 */
export function generateTOC(content: string): TOCItem[] {
  // 코드블럭을 제거한 후 제목 추출
  const codeBlockRegex = /```[\s\S]*?```/g;
  const inlineCodeRegex = /`[^`]+`/g;

  // 코드블럭과 인라인 코드 제거
  const cleanContent = content
    .replace(codeBlockRegex, '')
    .replace(inlineCodeRegex, '');

  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: TOCItem[] = [];
  let match;

  while ((match = headingRegex.exec(cleanContent)) !== null) {
    const level = match[1].length; // #의 개수
    const text = match[2].trim();
    const id = generateId(text);

    headings.push({
      id,
      text,
      level,
    });
  }

  return headings;
}

/**
 * 목차를 계층 구조로 변환
 * @param headings 평면적인 제목 배열
 * @returns 계층 구조의 목차
 */
export function buildTOCHierarchy(headings: TOCItem[]): TOCItem[] {
  const result: TOCItem[] = [];
  const stack: TOCItem[] = [];

  for (const heading of headings) {
    // 스택에서 현재 레벨보다 높은 레벨의 아이템들을 제거
    while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      // 최상위 레벨
      result.push(heading);
    } else {
      // 하위 레벨 - 부모의 children에 추가
      const parent = stack[stack.length - 1];
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(heading);
    }

    stack.push(heading);
  }

  return result;
}

/**
 * 목차를 렌더링용 HTML로 변환
 * @param toc 계층 구조의 목차
 * @returns HTML 문자열
 */
export function renderTOC(toc: TOCItem[]): string {
  function renderItems(items: TOCItem[], depth = 0): string {
    return items
      .map((item) => {
        const indent = '  '.repeat(depth);
        const children = item.children
          ? renderItems(item.children, depth + 1)
          : '';
        return `${indent}<a href="#${item.id}" class="block text-sm hover:text-primary transition-colors ${
          depth > 0 ? `pl-${depth * 4}` : ''
        }">${item.text}</a>${children}`;
      })
      .join('\n');
  }

  return renderItems(toc);
}
