import { MDXRemote } from 'next-mdx-remote/rsc';
import { MDXComponent } from '@components/mdx-component';
import { getPost, getParsedPosts } from '@utils/lib';
import { generateTOC, buildTOCHierarchy } from '@utils/toc';
import dynamic from 'next/dynamic';
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

// 클라이언트 컴포넌트들을 동적으로 임포트
const TOC = dynamic(() => import('@components/toc'), { ssr: false });

const Comments = dynamic(() => import('@components/comments'), { ssr: false });
const FloatingButton = dynamic(() => import('@components/floating-button'), {
  ssr: false,
});
const ActionButtons = dynamic(() => import('@components/action-buttons'), {
  ssr: false,
});

// 동적 경로 정의
export async function generateStaticParams() {
  const posts = await getParsedPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

/**
 * 블로그 포스트 상세 페이지
 * MDX 콘텐츠를 렌더링하고 댓글 기능을 제공합니다.
 */
export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);
  const allPosts = await getParsedPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === params.slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const relatedPosts = allPosts
    .filter((p) => p.slug !== params.slug)
    .slice(0, 3);

  // 목차 생성
  const headings = generateTOC(post.content);
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
        {post.frontmatter.category && (
          <Badge variant="secondary">{post.frontmatter.category}</Badge>
        )}

        <h1 className="text-3xl md:text-4xl lg:text-5xl leading-tight">
          {post.frontmatter.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.frontmatter.created}>
              {new Date(post.frontmatter.created).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
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
        {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {post.frontmatter.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <article className="lg:col-span-3 prose prose-neutral dark:prose-invert max-w-none">
          {/* Action Buttons - Sticky */}
          <ActionButtons />

          {/* Post Content */}
          <div className="prose-content space-y-6">
            <MDXRemote source={post.content} components={MDXComponent} />
          </div>
        </article>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Table of Contents */}
          {toc.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">목차</CardTitle>
              </CardHeader>
              <CardContent>
                <TOC items={toc} />
              </CardContent>
            </Card>
          )}

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
        </aside>
      </div>

      <SampleComponents title={post.frontmatter.title} />

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

      <FloatingButton />
    </div>
  );
}
