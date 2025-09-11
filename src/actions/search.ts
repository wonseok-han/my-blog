'use server';

import { searchPosts, getSearchSuggestions } from '@utils/search';
import { getParsedPosts } from '@utils/server';

/**
 * 서버 액션: 포스트 검색
 */
export async function searchPostsAction(query: string) {
  try {
    const posts = await getParsedPosts();
    return searchPosts(posts, query);
  } catch (error) {
    console.error('검색 실패:', error);
    return [];
  }
}

/**
 * 서버 액션: 검색 제안어 생성
 */
export async function getSearchSuggestionsAction(query: string) {
  try {
    const posts = await getParsedPosts();

    const allSuggestions = getSearchSuggestions(posts);

    // 입력된 쿼리와 관련된 제안어만 필터링
    if (query.trim()) {
      const filtered = allSuggestions
        .filter((suggestion) =>
          suggestion.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5); // 최대 5개만 반환
      return filtered;
    }

    const result = allSuggestions.slice(0, 10); // 쿼리가 없으면 상위 10개
    return result;
  } catch (error) {
    console.error('제안어 생성 실패:', error);
    return [];
  }
}
