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

      <div className="grid grid-cols-3 gap-x-[30px] gap-y-0 auto-rows-[1px]">
        {posts.slice(0, 9).map((post, index) => {
          const size = cardSizes[index % cardSizes.length];
          const isLarge = size === 'large';
          const isTall = size === 'tall';
          const isWide = size === 'wide';
          const isSmall = size === 'small';

          const colSpan = isLarge || isWide ? 'col-span-2' : 'col-span-1';

          // Рассчитываем высоту: изображение + контент (единый padding 20px + footer min-h-90px)
          // Большие карточки требуют больше места для крупного текста
          let rowSpan = '';
          if (isLarge) {
            // Large: квадратное изображение + крупный текст (4 строки 32px) + footer
            // Крупный текст занимает ~140px (4 строки), нужно значительно больше места
            rowSpan = 'row-span-[880]';
          } else if (isTall) {
            // Tall: квадратное изображение + средний текст (4 строки 26px) + footer
            // Средний текст занимает ~115px (4 строки)
            rowSpan = 'row-span-[750]';
          } else if (isWide) {
            // Wide: широкое изображение (2:1) + средний текст (3 строки) + footer
            rowSpan = 'row-span-[480]';
          } else if (isSmall) {
            // Small: компактное изображение (4:3) + маленький текст (2 строки) + footer
            rowSpan = 'row-span-[410]';
          } else {
            // Medium: квадратное изображение + средний текст (3 строки) + footer
            rowSpan = 'row-span-[540]';
          }

          let imageHeight = 'aspect-square';
          if (isWide) imageHeight = 'aspect-[2/1]';
          if (isSmall) imageHeight = 'aspect-[4/3]';

          let titleSize = 'text-[22px]';
          let titleLines = 'line-clamp-3';
          if (isLarge) {
            titleSize = 'text-[32px]';
            titleLines = 'line-clamp-4';
          } else if (isTall) {
            titleSize = 'text-[26px]';
            titleLines = 'line-clamp-4';
          } else if (isSmall) {
            titleSize = 'text-[18px]';
            titleLines = 'line-clamp-2';
          }

          // Единый padding для всех карточек для консистентности
          const padding = 'p-5';

          return (
            <Link
              key={post.id}
              href={`/redesign/post/${post.id}`}
              className={`${colSpan} ${rowSpan} mb-[30px] bg-white border border-gray-200 hover:border-black hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer group overflow-hidden`}
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

              <div className={`${padding} flex flex-col flex-grow justify-between`}>
                <div className="flex-shrink-0">
                  <div className="text-[11px] text-gray-500 mb-2 uppercase tracking-wide font-medium">
                    {index === 0 && 'Featured · '}
                    {formatDate(post.created_at)}
                  </div>

                  <h3 className={`${titleSize} ${titleLines} leading-tight mb-3 font-normal tracking-tight`}>
                    {post.text}
                  </h3>
                </div>

                <div className="pt-3 border-t border-gray-100 mt-auto flex-shrink-0 min-h-[90px]">
                  <div className="text-[13px] font-semibold mb-2 truncate overflow-hidden">
                    By {post.author_name || 'Anonymous'}
                  </div>
                  <div className="flex gap-4 text-[12px] text-gray-500 flex-wrap">
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
