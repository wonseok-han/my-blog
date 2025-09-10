import { PostType } from '@/types/post';

/**
 * 포스트 검색 함수
 * 제목, 설명, 태그, 카테고리에서 검색어를 찾습니다.
 */
export const searchPosts = (posts: PostType[], query: string): PostType[] => {
  if (!query.trim()) {
    return posts;
  }

  const searchTerm = query.toLowerCase().trim();

  return posts.filter((post) => {
    // 제목 검색
    const titleMatch = post.title.toLowerCase().includes(searchTerm);

    // 설명 검색
    const descriptionMatch =
      post.description?.toLowerCase().includes(searchTerm) || false;

    // 카테고리 검색
    const categoryMatch =
      post.category?.toLowerCase().includes(searchTerm) || false;

    // 태그 검색
    const tagsMatch =
      post.tags?.some((tag) => tag.toLowerCase().includes(searchTerm)) || false;

    return titleMatch || descriptionMatch || categoryMatch || tagsMatch;
  });
};

/**
 * 검색 결과 하이라이트 함수
 * 검색어와 일치하는 부분을 강조합니다.
 */
export const highlightSearchTerm = (
  text: string,
  searchTerm: string
): string => {
  if (!searchTerm.trim()) {
    return text;
  }

  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(
    regex,
    '<mark class="bg-yellow-200 dark:bg-yellow-400 px-1 rounded">$1</mark>'
  );
};

/**
 * 검색어 추천 함수
 * 기존 포스트에서 자주 사용되는 단어들을 추출합니다.
 */
export const getSearchSuggestions = (posts: PostType[]): string[] => {
  const wordCount = new Map<string, number>();

  posts.forEach((post) => {
    // 제목에서 단어 추출
    const titleWords = post.title
      .toLowerCase()
      .replace(/[^\w\s가-힣]/g, '')
      .split(/\s+/)
      .filter((word) => word.length > 1);

    // 설명에서 단어 추출
    const descriptionWords =
      post.description
        ?.toLowerCase()
        .replace(/[^\w\s가-힣]/g, '')
        .split(/\s+/)
        .filter((word) => word.length > 1) || [];

    // 태그에서 단어 추출
    const tagWords = post.tags?.map((tag) => tag.toLowerCase()) || [];

    [...titleWords, ...descriptionWords, ...tagWords].forEach((word) => {
      if (word.length > 1) {
        wordCount.set(word, (wordCount.get(word) || 0) + 1);
      }
    });
  });

  // 빈도순으로 정렬하고 상위 10개 반환
  return Array.from(wordCount.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
};
