import { getPosts } from '@/lib/api';
import { PostGrid } from '@/components/PostGrid';
import { Header } from '@/components/Header';

export default async function Home() {
  // Fetch initial posts using Server Component
  const data = await getPosts(1, 20, 'newest');

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-blue-50 to-purple-50">
      {/* Header */}
      <Header />

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
