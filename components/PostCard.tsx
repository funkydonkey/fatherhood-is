import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/types';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Link href={`/post/${post.id}`}>
      <article className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:shadow-xl hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-50">
          <Image
            src={post.image_url}
            alt={post.text}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Text */}
          <p className="mb-2 text-sm font-medium text-gray-900 line-clamp-2">
            Fatherhood is... {post.text}
          </p>

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              {post.author_name && (
                <span className="font-medium text-gray-700">{post.author_name}</span>
              )}
              <span>{formattedDate}</span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3">
              {post.likes_count > 0 && (
                <span className="flex items-center gap-1">
                  <svg
                    className="h-4 w-4 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {post.likes_count}
                </span>
              )}
              {post.comments_count > 0 && (
                <span className="flex items-center gap-1">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  {post.comments_count}
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
