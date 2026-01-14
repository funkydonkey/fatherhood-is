'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/types';

interface PostGridEditorialProps {
  posts: Post[];
}

export function PostGridEditorial({ posts }: PostGridEditorialProps) {
  // Определяем размеры для карточек в паттерне
  const cardSizes = ['large', 'medium', 'small', 'wide', 'tall', 'medium', 'small', 'medium', 'small'];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <section className="py-[100px]">
      <div className="mb-[60px] pb-6 border-b-[3px] border-black">
        <div className="text-[13px] font-semibold tracking-[2px] uppercase mb-1">
          Recent Stories
        </div>
        <h2 className="text-[52px] font-normal mt-2 tracking-tight">
          Shared Moments
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-[30px] auto-rows-[50px]">
        {posts.slice(0, 9).map((post, index) => {
          const size = cardSizes[index % cardSizes.length];
          const isLarge = size === 'large';
          const isTall = size === 'tall';
          const isWide = size === 'wide';
          const isSmall = size === 'small';

          const colSpan = isLarge || isWide ? 'col-span-2' : 'col-span-1';
          let rowSpan = 'row-span-10'; // medium
          if (isLarge) rowSpan = 'row-span-12';
          if (isTall) rowSpan = 'row-span-14';
          if (isSmall) rowSpan = 'row-span-8';
          if (isWide) rowSpan = 'row-span-8';

          const imageHeight = isSmall || isWide ? 'h-[50%]' : isTall ? 'h-[65%]' : 'h-[60%]';

          let titleSize = 'text-[22px]';
          if (isLarge) titleSize = 'text-[32px]';
          else if (isTall) titleSize = 'text-[26px]';
          else if (isSmall) titleSize = 'text-[18px]';

          return (
            <Link
              key={post.id}
              href={`/redesign/post/${post.id}`}
              className={`${colSpan} ${rowSpan} bg-white border border-gray-200 hover:border-black hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer group`}
            >
              <div className={`${imageHeight} relative bg-gray-50 border-b border-gray-200 flex-shrink-0 overflow-hidden`}>
                {post.image_url ? (
                  <Image
                    src={post.image_url}
                    alt={post.text}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-5 border border-gray-200" />
                )}
              </div>

              <div className={`${isLarge || isTall ? 'p-5' : 'p-4'} flex-1 flex flex-col`}>
                <div className="text-[11px] text-gray-500 mb-2 uppercase tracking-wide font-medium">
                  {index === 0 && 'Featured · '}
                  {formatDate(post.created_at)}
                  {!isSmall && ' · 5 min read'}
                </div>

                <h3 className={`${titleSize} leading-tight mb-2 font-normal tracking-tight`}>
                  {post.text}
                </h3>

                <div className="mt-auto pt-3 border-t border-gray-100">
                  <div className="text-[13px] font-semibold mb-2">
                    By {post.author_name || 'Anonymous'}
                  </div>
                  <div className="flex gap-4 text-[12px] text-gray-500">
                    {post.likes_count > 0 && <span>{post.likes_count} Likes</span>}
                    {post.comments_count > 0 && <span>{post.comments_count} Comments</span>}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
