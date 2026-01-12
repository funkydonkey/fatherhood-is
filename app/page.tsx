import Link from 'next/link';
import { getPosts } from '@/lib/api';
import { PostGrid } from '@/components/PostGrid';

export default async function Home() {
  // Fetch initial posts using Server Component
  const data = await getPosts(1, 20, 'newest');

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Fatherhood Is...
              </h1>
            </div>
            <Link
              href="/create"
              className="rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 hover:bg-gray-800"
            >
              Share Your Story
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero section */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl">
            What does fatherhood mean to you?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Share your definition of fatherhood and see beautiful illustrations
            in the style of &quot;Love Is...&quot; comics
          </p>
        </div>

        {/* Stats */}
        {data.pagination.total > 0 && (
          <div className="mb-8 text-center">
            <p className="text-sm text-gray-600">
              {data.pagination.total} {data.pagination.total === 1 ? 'story' : 'stories'} shared
            </p>
          </div>
        )}

        {/* Posts grid with client-side pagination */}
        <PostGrid
          initialPosts={data.posts}
          initialPage={data.pagination.page}
          totalPages={data.pagination.pages}
        />
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Inspired by &quot;Love Is...&quot; by Kim Casali
          </p>
        </div>
      </footer>
    </div>
  );
}
