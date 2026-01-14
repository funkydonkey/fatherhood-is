import { getPost } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { HeaderEditorial } from '@/components/redesign/HeaderEditorial';
import { Comments } from '@/components/Comments';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const post = await getPost(id);

    return {
      title: `Fatherhood is... ${post.text} | Fatherhood Is`,
      description: `${post.author_name ? `${post.author_name}'s story: ` : ''}Fatherhood is ${post.text}`,
      openGraph: {
        title: `Fatherhood is... ${post.text}`,
        description: post.text,
        images: [post.image_url],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: `Fatherhood is... ${post.text}`,
        description: post.text,
        images: [post.image_url],
      },
    };
  } catch {
    return {
      title: 'Post Not Found | Fatherhood Is',
    };
  }
}

export default async function PostPageRedesign({ params }: Props) {
  const { id } = await params;

  let post;

  try {
    post = await getPost(id);
  } catch (error) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <HeaderEditorial />

      <div className="max-w-[900px] mx-auto px-10 py-[60px]">
        {/* Back Button */}
        <Link
          href="/redesign"
          className="inline-flex items-center gap-2 text-sm hover:opacity-60 transition-opacity mb-8 font-medium"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Stories
        </Link>

        {/* Post Article */}
        <article className="border-[3px] border-black bg-white shadow-[12px_12px_0_0_rgba(0,0,0,1)]">
          {/* Image */}
          <div className="relative w-full aspect-square bg-gray-50 border-b-[3px] border-black">
            <Image
              src={post.image_url}
              alt={`Fatherhood is ${post.text}`}
              fill
              className="object-contain p-8"
              priority
            />
          </div>

          {/* Content */}
          <div className="p-10">
            {/* Category */}
            <div className="text-[11px] font-semibold tracking-[2px] uppercase text-gray-500 mb-4">
              Personal Story · Featured
            </div>

            {/* Text */}
            <h1 className="text-[42px] font-normal leading-tight tracking-tight text-gray-900 mb-6">
              Fatherhood is... <span className="italic">{post.text}</span>
            </h1>

            {/* Author */}
            {post.author_name && (
              <p className="text-[17px] text-gray-600 mb-6 border-l-4 border-black pl-5">
                Shared by <span className="font-semibold text-gray-900">{post.author_name}</span>
              </p>
            )}

            {/* Metadata */}
            <div className="flex items-center gap-8 text-[13px] text-gray-600 border-t-2 border-gray-200 pt-6 mt-6">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span className="font-semibold">{post.likes_count || 0} Likes</span>
              </div>

              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
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
                <span className="font-semibold">{post.comments_count || 0} Comments</span>
              </div>

              <div className="ml-auto text-gray-500 tracking-wide">
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>

          {/* Comments section */}
          <div className="px-10 pb-10 border-t-2 border-gray-200">
            <Comments postId={post.id} />
          </div>
        </article>

        {/* Share Your Own Story CTA */}
        <div className="mt-[80px] text-center py-[60px] border-t-[3px] border-b-[3px] border-black">
          <h2 className="text-[32px] font-normal mb-4 tracking-tight">
            Share Your Definition
          </h2>
          <p className="text-[17px] text-gray-600 mb-8">
            What does fatherhood mean to you?
          </p>
          <Link
            href="/redesign/create"
            className="inline-block bg-black text-white font-semibold px-[40px] py-[16px] text-[13px] tracking-[2px] uppercase hover:bg-gray-800 transition-colors"
          >
            Create Your Post
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t-[3px] border-black py-10 mt-[60px]">
        <div className="max-w-[1100px] mx-auto px-10 text-center">
          <p className="text-[13px] text-gray-600 tracking-wider">
            © 2026 Fatherhood Is. A literary platform for fathers.
          </p>
        </div>
      </footer>
    </div>
  );
}
