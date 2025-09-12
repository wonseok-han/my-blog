import { generateTOC, buildTOCHierarchy } from '@utils/toc';
import SampleComponents from '@components/posts/sample-components';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Calendar,
  Clock,
  Heart,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { apiGet, parseApiResponse } from '@/utils/client';
import { PostType, PostsResponseType } from '@typings/post';
import ActionButtons from '@components/action-buttons';
import MDXRenderer from '@components/mdx-renderer';
import TOC from '@components/toc';
import Comments from '@components/comments';
import { Metadata } from 'next';

interface PostDetailResponse {
  post: PostType;
  content: string;
}

/**
 * 포스트 상세 페이지 메타데이터 생성
 * @param params - URL 파라미터
 * @returns 메타데이터
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  try {
    // 포스트 데이터 가져오기
    const postResponse = await apiGet(`/api/posts/${decodedSlug}`);
    const postData = await parseApiResponse<PostDetailResponse>(postResponse);
    const { post } = postData;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const postUrl = `${baseUrl}/posts/${slug}`;

    return {
      title: `${post.title} | 까먹을게 분명하기 때문에 기록하는 블로그`,
      description: post.description || `${post.title}에 대한 포스트입니다.`,
      keywords: [
        '개발 블로그',
        '프론트엔드',
        '웹 개발',
        post.category || '',
        ...(post.tags || []),
      ],
      authors: [{ name: 'wonseok-han' }],
      openGraph: {
        title: post.title,
        description: post.description || `${post.title}에 대한 포스트입니다.`,
        type: 'article',
        locale: 'ko_KR',
        url: postUrl,
        publishedTime: post.created,
        modifiedTime: post.created,
        authors: ['wonseok-han'],
        section: post.category,
        tags: post.tags,
      },
      robots: {
        index: true,
        follow: true,
      },
      alternates: {
        canonical: postUrl,
      },
    };
  } catch (error) {
    return {
      title:
        '포스트를 찾을 수 없습니다 | 까먹을게 분명하기 때문에 기록하는 블로그',
      description: '요청하신 포스트를 찾을 수 없습니다.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

/**
 * 블로그 포스트 상세 페이지 (서버 컴포넌트)
 * API를 통해 포스트 데이터를 가져와 MDX 콘텐츠를 렌더링합니다.
 */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  try {
    // 개별 포스트 데이터 가져오기
    const postResponse = await apiGet(`/api/posts/${decodedSlug}`);
    const postData = await parseApiResponse<PostDetailResponse>(postResponse);

    // 모든 포스트 데이터 가져오기 (관련 포스트용)
    const allPostsResponse = await apiGet('/api/posts', {
      limit: '1000',
    });
    const allPostsData =
      await parseApiResponse<PostsResponseType>(allPostsResponse);

    const { post, content } = postData;
    const allPosts = allPostsData.posts;
    const currentIndex = allPosts.findIndex((p) => p.slug === decodedSlug);
    const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
    const nextPost =
      currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
    const relatedPosts = allPosts
      .filter((p) => p.slug !== decodedSlug)
      .slice(0, 3);

    // 목차 생성
    const headings = generateTOC(content);
    const toc = buildTOCHierarchy(headings);

    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Button */}
        <div className="mb-8">
          <Button variant="ghost" className="gap-2" asChild>
            <Link href="/posts">
              <ChevronLeft className="h-4 w-4" />
              모든 포스트로 돌아가기
            </Link>
          </Button>
        </div>

        {/* Post Header */}
        <header className="mb-8 space-y-4">
          {post.category && <Badge variant="secondary">{post.category}</Badge>}

          <h1 className="text-3xl md:text-4xl lg:text-5xl leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.created}>
                {new Date(post.created).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                })}
              </time>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>5분 읽기</span>
            </div>

            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span>24</span>
            </div>

            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>8개 댓글</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-3 max-w-none">
            {/* Action Buttons - Sticky */}
            <ActionButtons />

            {/* Post Content */}
            <div className="space-y-6">
              <MDXRenderer content={content} />
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Related Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">관련 포스트</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.slug}
                    href={`/posts/${relatedPost.slug}`}
                    className="block group w-full text-left"
                  >
                    <h4 className="line-clamp-2 group-hover:text-primary transition-colors text-sm mb-1">
                      {relatedPost.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <time dateTime={relatedPost.created}>
                        {new Date(relatedPost.created).toLocaleDateString(
                          'ko-KR',
                          {
                            month: 'short',
                            day: 'numeric',
                          }
                        )}
                      </time>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Table of Contents */}
            {toc.length > 0 && (
              <Card className="sticky top-20 lg:overflow-y-auto lg:max-h-[calc(100vh-10rem)]">
                <CardHeader>
                  <CardTitle className="text-lg">목차</CardTitle>
                </CardHeader>
                <CardContent>
                  <TOC items={toc} />
                </CardContent>
              </Card>
            )}
          </aside>
        </div>

        <SampleComponents title={post.title} />

        <Separator className="my-12" />

        <Comments />

        <Separator className="my-12" />

        {/* Navigation */}
        <nav className="flex justify-between items-center">
          {prevPost ? (
            <Button variant="ghost" className="gap-2" asChild>
              <Link href={`/posts/${prevPost.slug}`}>
                <ChevronLeft className="h-4 w-4" />
                이전 포스트: {prevPost.title}
              </Link>
            </Button>
          ) : (
            <div />
          )}

          {nextPost && (
            <Button variant="ghost" className="gap-2" asChild>
              <Link href={`/posts/${nextPost.slug}`}>
                다음 포스트: {nextPost.title}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </nav>
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">포스트를 찾을 수 없습니다</h1>
          <Button asChild>
            <Link href="/posts">모든 포스트로 돌아가기</Link>
          </Button>
        </div>
      </div>
    );
  }
}
