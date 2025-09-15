import { useQuery } from '@tanstack/react-query';
import { apiGet, parseApiResponse } from '@/utils/client';
import { PostStatsResponseType } from '@typings/post';

export function usePostStats(pathOrSlug: { slug?: string }) {
  const { slug } = pathOrSlug;
  const queryKey = ['post-stats', slug || ''];

  return useQuery({
    queryKey,
    enabled: Boolean(slug),
    queryFn: async () => {
      const response = await apiGet('/api/stats', {
        ...(slug ? { slug } : {}),
      });
      return parseApiResponse<PostStatsResponseType>(response);
    },
    staleTime: 1000 * 60 * 5, // 5분
  });
}
