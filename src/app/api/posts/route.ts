import { NextRequest, NextResponse } from 'next/server';
import { getParsedPosts } from '@/utils/server';

/**
 * 포스트 목록 조회 API
 * GET /api/posts?page=1&limit=10&search=&category=&sortBy=latest
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sortBy = searchParams.get('sortBy') || 'latest';
    const tags = searchParams.get('tags') || '';

    // 모든 포스트 가져오기
    const allPosts = await getParsedPosts();

    // 필터링 및 정렬
    let filteredPosts = allPosts;

    // 검색 필터
    if (search) {
      filteredPosts = filteredPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.description?.toLowerCase().includes(search.toLowerCase()) ||
          post.tags?.some((tag) =>
            tag.toLowerCase().includes(search.toLowerCase())
          )
      );
    }

    // 카테고리 필터
    if (category && category !== 'all') {
      filteredPosts = filteredPosts.filter(
        (post) => post.category === category
      );
    }

    // 태그 필터
    if (tags && tags !== 'all') {
      const selectedTags = tags
        .split(',')
        .map((tag) => tag.trim().toLowerCase());
      filteredPosts = filteredPosts.filter((post) =>
        selectedTags.some((selectedTag) =>
          post.tags?.some((postTag) =>
            postTag.toLowerCase().includes(selectedTag)
          )
        )
      );
    }

    // 정렬
    filteredPosts.sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.created).getTime() - new Date(a.created).getTime();
      }
      return a.title.localeCompare(b.title);
    });

    // 카테고리별 포스트 수 계산
    const categoryCount = allPosts.reduce(
      (acc, post) => {
        const category = post.category || '미분류';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // 페이지네이션
    const total = filteredPosts.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const posts = filteredPosts.slice(startIndex, endIndex);

    // 카테고리 목록 추출
    const categories = Array.from(
      new Set(allPosts.map((post) => post.category).filter(Boolean))
    );

    // 태그 목록 추출
    const allTags = Array.from(
      new Set(allPosts.flatMap((post) => post.tags || []))
    );

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      filters: {
        categories,
        tags: allTags,
        totalCategories: categoryCount,
      },
    });
  } catch (error) {
    console.error('포스트 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '포스트 목록을 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
