import { NextRequest, NextResponse } from 'next/server';
import { calculateReadingTime, formatReadingTime } from '@/utils/reading-time';
import { getPost } from '@/utils/server';

export const revalidate = 300; // 5분 캐시

type ReactionsSummary = {
  heart: number;
  plusOne: number;
  minusOne: number;
  laugh: number;
  hooray: number;
  confused: number;
  rocket: number;
  eyes: number;
  total: number;
};

async function fetchDiscussionReactionsAndComments(postPath: string) {
  const repoName = process.env.NEXT_PUBLIC_GISCUS_MY_REPO_NAME;
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_MY_CATEGORY_ID;
  const ghToken = process.env.GITHUB_TOKEN; // 선택 사항 (레이트 리밋 완화)

  if (!repoName || !categoryId) {
    return { reactions: null as ReactionsSummary | null, comments: 0 };
  }

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
  };
  if (ghToken) headers.Authorization = `Bearer ${ghToken}`;

  // 1) GraphQL Search로 제목 정확 매칭 (있으면 우선 사용)
  let discussionNumber: number | null = null;
  if (ghToken) {
    try {
      const searchQuery = `repo:${repoName} is:discussion in:title "${postPath}"`;
      const gql = {
        query:
          'query($q:String!){ search(type:DISCUSSION, query:$q, first:1){ nodes { ... on Discussion { number title url category { id } } } } }',
        variables: { q: searchQuery },
      };
      const gqlRes = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: { ...headers, Authorization: `Bearer ${ghToken}` },
        body: JSON.stringify(gql),
        next: { revalidate },
      });
      if (gqlRes.ok) {
        const data = await gqlRes.json();
        const node = data?.data?.search?.nodes?.[0];
        if (node?.number && node?.category?.id === categoryId) {
          discussionNumber = node.number;
        }
      }
    } catch (_) {
      console.error('GraphQL 실패', JSON.stringify(_, null, 2));
      // GraphQL 실패 시 폴백
    }
  }

  // 1-폴백) REST: 제목 포함 검색(첫 페이지) — 과도한 페이지 순회 방지
  if (!discussionNumber) {
    const listUrl = `https://api.github.com/repos/${repoName}/discussions?category_id=${categoryId}&per_page=100`;
    const listRes = await fetch(listUrl, {
      headers,
      next: { revalidate },
    });
    if (!listRes.ok) {
      return { reactions: null as ReactionsSummary | null, comments: 0 };
    }
    type DiscussionLite = { number: number; title?: string; body?: string };
    const discussions = (await listRes.json()) as DiscussionLite[];
    console.log('discussions', JSON.stringify(discussions, null, 2));
    const target = discussions.find((d) => d?.title?.includes(postPath));
    if (!target) {
      return { reactions: null as ReactionsSummary | null, comments: 0 };
    }
    discussionNumber = target.number;
  }

  // 2) 상세 조회로 reactions/댓글 수 확보
  const detailUrl = `https://api.github.com/repos/${repoName}/discussions/${discussionNumber}`;
  const detailRes = await fetch(detailUrl, {
    headers,
    next: { revalidate },
  });
  if (!detailRes.ok) {
    return { reactions: null as ReactionsSummary | null, comments: 0 };
  }
  const detail = await detailRes.json();
  const r = detail.reactions || {};
  const reactions: ReactionsSummary = {
    heart: r.heart ?? 0,
    plusOne: r['+1'] ?? 0,
    minusOne: r['-1'] ?? 0,
    laugh: r.laugh ?? 0,
    hooray: r.hooray ?? 0,
    confused: r.confused ?? 0,
    rocket: r.rocket ?? 0,
    eyes: r.eyes ?? 0,
    total: r.total_count ?? 0,
  };

  const comments = typeof detail.comments === 'number' ? detail.comments : 0;
  return { reactions, comments };
}

/**
 * GET /api/stats?slug=...  또는  /api/stats?path=/posts/...
 * 응답: { readingTime: { minutes, label }, reactions, comments }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug') || '';

    if (!slug) {
      return NextResponse.json(
        { error: 'slug 쿼리 파라미터가 필요합니다.' },
        { status: 400 }
      );
    }

    const postPath = `posts/${slug}`;

    // 읽기 시간: MDX 콘텐츠 기반 계산
    let readingMinutes = 1;
    let readingLabel = '1분 읽기';
    try {
      if (slug) {
        const { content } = getPost(decodeURIComponent(slug));
        readingMinutes = calculateReadingTime(content);
        readingLabel = formatReadingTime(readingMinutes);
      }
    } catch (_) {
      // slug 없이 path만 온 경우 등: 읽기 시간은 보수적으로 1분 처리
    }

    // 리액션/댓글 수: GitHub Discussions 통해 조회
    const { reactions, comments } =
      await fetchDiscussionReactionsAndComments(postPath);

    return NextResponse.json({
      readingTime: { minutes: readingMinutes, label: readingLabel },
      reactions,
      comments,
    });
  } catch (error) {
    console.error('stats API 오류:', error);
    return NextResponse.json(
      { error: '통계를 불러오지 못했습니다.' },
      { status: 500 }
    );
  }
}
