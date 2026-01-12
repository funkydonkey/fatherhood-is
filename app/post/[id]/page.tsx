import { getPost } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Header } from '@/components/Header';
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

export default async function PostPage({ params }: Props) {
  const { id } = await params;

  let post;

  try {
    post = await getPost(id);
  } catch (error) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-blue-50">
      <Header />

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </Link>

        {/* Post Card */}
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Image */}
          <div className="relative w-full max-w-md mx-auto aspect-[2/3] bg-gradient-to-br from-pink-100 to-blue-100">
            <Image
              src={post.image_url}
              alt={`Fatherhood is ${post.text}`}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Text */}
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
              Fatherhood is... <span className="text-pink-600">{post.text}</span>
            </h1>

            {/* Author */}
            {post.author_name && (
              <p className="text-gray-600 mb-4 text-sm">
                Shared by <span className="font-semibold text-gray-900">{post.author_name}</span>
              </p>
            )}

            {/* Metadata */}
            <div className="flex items-center gap-6 text-sm text-gray-500 border-t pt-4">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold">{post.likes_count || 0}</span>
              </div>

              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-400"
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
                <span className="font-semibold">{post.comments_count || 0}</span>
              </div>

              <div className="ml-auto text-gray-400">
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>

          {/* Comments section */}
          <div className="px-6 pb-6">
            <Comments postId={post.id} />
          </div>
        </article>

        {/* Share Your Own Story CTA */}
        <div className="mt-6 text-center pb-4">
          <p className="text-gray-600 mb-3 text-sm">Have your own story to share?</p>
          <Link
            href="/create"
            className="inline-block bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold px-6 py-2.5 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm"
          >
            Share Your Story
          </Link>
        </div>
      </div>
    </div>
  );
}
