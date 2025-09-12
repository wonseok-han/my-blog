import { NextRequest, NextResponse } from 'next/server';
import { getPost } from '@/utils/server';

/**
 * 개별 포스트 조회 API
 * GET /api/posts/[slug]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
      return NextResponse.json(
        { error: '포스트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      post: post.frontmatter,
      content: post.content,
    });
  } catch (error) {
    console.error('포스트 조회 오류:', error);
    return NextResponse.json(
      { error: '포스트를 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
