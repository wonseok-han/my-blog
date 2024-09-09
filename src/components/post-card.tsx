import { PostType } from '@/types/post';
import Image from 'next/image';

interface PostCardProps extends PostType {}

const PostCard = ({ title, created, thumbnail }: PostCardProps) => {
  return (
    <div className="w-full h-full overflow-hidden rounded-2xl">
      <div className="border-gray-800">
        {thumbnail ? (
          <Image
            className="h-64 w-full object-cover"
            alt="postImage"
            src={thumbnail}
            width={300}
            height={300}
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
            width={100}
            height={100}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        )}
      </div>
      <div className="bg-gray-200 h-16 px-3 py-2 space-y-2 ">
        <p
          className="text-ellipsis text-nowrap overflow-hidden font-semibold text-black"
          title={title}
        >
          {title}
        </p>
        <p className="text-sm font-semibold text-right text-gray-700">
          {created}
        </p>
      </div>
    </div>
  );
};

export default PostCard;
