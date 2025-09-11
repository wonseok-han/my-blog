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
