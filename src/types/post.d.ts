/**
 * 포스트 메타데이터 타입 정의
 */
export type PostMetadataType = {
  created: string;
  modified: string;
  source: 'git' | 'filesystem' | 'fallback';
};

/**
 * 포스트 타입 정의
 */
export type PostType = {
  title: string;
  description?: string;
  thumbnail?: string;
  created: string;
  category?: string;
  tags?: string[];
  slug?: string;
  gitInfo?: {
    created: string;
    modified: string;
    commitCount: number;
    source: 'git' | 'filesystem' | 'metadata' | 'fallback';
  };
};

/**
 * 포스트 목록 응답 타입 정의
 */
export type PostsResponseType = {
  posts: PostType[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    categories: string[];
    tags: string[];
    totalCategories: Record<string, number>;
  };
};

/**
 * 포스트 상세 응답 타입 정의
 */
export type PostDetailResponseType = {
  post: PostType;
  content: string;
};

/**
 * 포스트 통계 응답 타입 정의
 */
export type PostStatsResponseType = {
  readingTime: { minutes: number; label: string };
  reactions: {
    heart: number;
    plusOne: number;
    minusOne: number;
    laugh: number;
    hooray: number;
    confused: number;
    rocket: number;
    eyes: number;
    total: number;
  } | null;
  comments: number;
};
