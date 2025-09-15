/**
 * 포스트 메타데이터 타입 정의
 */
export type PostMetadataType = {
  created: string;
  modified: string;
  source: 'git' | 'filesystem' | 'fallback';
};

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

export type PostDetailResponseType = {
  post: PostType;
  content: string;
};
