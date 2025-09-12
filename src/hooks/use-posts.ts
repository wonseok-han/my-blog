import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { apiGet, parseApiResponse } from '@/utils/client';
import { PostDetailResponseType, PostsResponseType } from '@typings/post';

/**
 * 포스트 목록을 무한스크롤로 조회하는 훅
 */
export function useInfinitePosts(params: {
  search?: string;
  category?: string;
  sortBy?: string;
  limit?: number;
  tags?: string[];
}) {
  return useInfiniteQuery({
    queryKey: [
      'posts',
      'infinite',
      params.search || '',
      params.category || '',
      params.sortBy || 'latest',
      params.limit || 10,
      params.tags?.sort().join(',') || '',
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await apiGet('/api/posts', {
        page: pageParam.toString(),
        limit: (params.limit || 10).toString(),
        search: params.search || '',
        category: params.category || '',
        sortBy: params.sortBy || 'latest',
        tags: params.tags?.join(',') || '',
      });
      return parseApiResponse<PostsResponseType>(response);
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNext
        ? lastPage.pagination.page + 1
        : undefined;
    },
    initialPageParam: 1,
  });
}

/**
 * 포스트 목록을 페이지네이션으로 조회하는 훅
 */
export function usePosts(params: {
  page?: number;
  search?: string;
  category?: string;
  sortBy?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: async () => {
      const response = await apiGet('/api/posts', {
        page: (params.page || 1).toString(),
        limit: (params.limit || 10).toString(),
        search: params.search || '',
        category: params.category || '',
        sortBy: params.sortBy || 'latest',
      });
      return parseApiResponse<PostsResponseType>(response);
    },
  });
}

/**
 * 개별 포스트를 조회하는 훅
 */
export function usePost(slug: string) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      const response = await apiGet(`/api/posts/${slug}`);
      return parseApiResponse<PostDetailResponseType>(response);
    },
    enabled: !!slug,
  });
}
