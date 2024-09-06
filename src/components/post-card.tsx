import { PostType } from '@/types/post';
import Image from 'next/image';

interface PostCardProps extends PostType {}

const PostCard = ({ title, created }: PostCardProps) => {
  return (
    <div className="w-full h-full overflow-hidden rounded-2xl">
      <div className="border-gray-800">
        <Image
          className="h-64 w-full object-cover"
          alt="postImage"
          src="/sample/testImg.jpg"
          width={300}
          height={300}
        />
      </div>
      <div className="bg-gray-200 h-16 px-3 py-2 space-y-2">
        <p
          className="text-ellipsis text-nowrap overflow-hidden font-semibold"
          title={title}
        >
          {title}
        </p>
        <p className="text-sm font-semibold text-right">{created}</p>
      </div>
    </div>
  );
};

export default PostCard;
