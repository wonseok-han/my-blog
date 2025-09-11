import { PostType } from '@/types/post';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

interface PostCardProps extends PostType {}

/**
 * 블로그 포스트 카드 컴포넌트
 * 포스트의 썸네일, 제목, 작성일, 카테고리, 태그를 표시합니다.
 */
const PostCard = ({
  title,
  created,
  thumbnail,
  category,
  tags,
  description,
}: PostCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-card/50 hover:bg-card h-full">
      <CardContent className="p-6 h-full flex flex-col">
        {thumbnail ? (
          <div className="my-4 w-full h-48 overflow-hidden rounded-lg relative">
            <Image
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              alt={title}
              src={thumbnail}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

        <div className="space-y-3 flex-1 flex flex-col">
          {category && (
            <Badge variant="secondary" className="text-xs w-fit">
              {category}
            </Badge>
          )}

          <h3
            className="line-clamp-2 group-hover:text-primary transition-colors font-semibold"
            title={title}
          >
            {title}
          </h3>

          {description && (
            <p className="text-muted-foreground line-clamp-2 text-sm flex-1">
              {description}
            </p>
          )}

          <div className="space-y-2 mt-auto">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <time dateTime={created}>
                {new Date(created).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
              </time>
            </div>

            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs px-2 py-0.5 font-normal"
                  >
                    {tag}
                  </Badge>
                ))}
                {tags.length > 3 && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5">
                    +{tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
