import { NextResponse } from 'next/server';
import { apiGet, parseApiResponse } from '@/utils/client';
import { PostsResponseType } from '@typings/post';

/**
 * RSS 피드 생성 API
 * GET /api/rss
 */
export async function GET() {
  try {
    // 최근 포스트 20개 가져오기
    const response = await apiGet('/api/posts', {
      page: '1',
      limit: '20',
      sortBy: 'latest',
    });

    const postsData = await parseApiResponse<PostsResponseType>(response);
    const posts = postsData.posts;

    // RSS XML 생성
    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>까먹을게 분명하기 때문에 기록하는 블로그</title>
    <description>개발 경험과 학습 내용을 기록하고 공유하는 공간입니다.</description>
    <link>${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}</link>
    <language>ko-KR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/rss" rel="self" type="application/rss+xml"/>
    
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description || ''}]]></description>
      <link>${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/posts/${post.slug}</link>
      <guid isPermaLink="true">${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/posts/${post.slug}</guid>
      <pubDate>${new Date(post.created).toUTCString()}</pubDate>
      <category><![CDATA[${post.category}]]></category>
      ${post.tags?.map((tag) => `<category><![CDATA[${tag}]]></category>`).join('') || ''}
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

    return new NextResponse(rssXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // 1시간 캐시
      },
    });
  } catch (error) {
    console.error('RSS 생성 오류:', error);
    return new NextResponse('RSS 피드를 생성할 수 없습니다.', { status: 500 });
  }
}
