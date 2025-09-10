import { PostType } from '@/types/post';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface PostProps {
  post: PostType & { slug: string };
}

/**
 * 개별 포스트 컴포넌트
 * 포스트 목록에서 각 포스트를 표시합니다.
 */
const Post = ({ post }: PostProps) => {
  return (
    <Link href={`posts/${post.slug}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-card/50 hover:bg-card">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              {post.thumbnail ? (
                <Image
                  loading="lazy"
                  className="object-cover rounded-lg w-24 h-24"
                  alt={post.title}
                  src={post.thumbnail}
                  width={96}
                  height={96}
                />
              ) : (
                <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8 text-muted-foreground"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h2>
              {post.description && (
                <p className="text-muted-foreground mt-2 line-clamp-2">
                  {post.description}
                </p>
              )}

              <div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.created}>{post.created}</time>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Post;
