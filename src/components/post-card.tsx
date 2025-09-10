import { PostType } from '@/types/post';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface PostCardProps extends PostType {}

/**
 * 블로그 포스트 카드 컴포넌트
 * 포스트의 썸네일, 제목, 작성일을 표시합니다.
 */
const PostCard = ({ title, created, thumbnail }: PostCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-card/50 hover:bg-card">
      <CardContent className="p-6">
        {thumbnail ? (
          <div className="mb-4 overflow-hidden rounded-lg">
            <Image
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              alt={title}
              src={thumbnail}
              width={300}
              height={192}
              loading="lazy"
            />
          </div>
        ) : (
          <div className="mb-4 w-full h-48 bg-muted rounded-lg flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-16 h-16 text-muted-foreground"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </div>
        )}

        <div className="space-y-3">
          <h3
            className="line-clamp-2 group-hover:text-primary transition-colors font-semibold"
            title={title}
          >
            {title}
          </h3>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <time dateTime={created}>{created}</time>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
