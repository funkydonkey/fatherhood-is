import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 Icon */}
        <div className="mb-8">
          <svg
            className="mx-auto h-24 w-24 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Post Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          The story you're looking for doesn't exist or has been removed.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Browse Stories
          </Link>
          <Link
            href="/create"
            className="inline-block bg-white text-gray-700 font-semibold px-6 py-3 rounded-full border-2 border-gray-300 hover:border-pink-500 hover:text-pink-500 transition-all duration-300"
          >
            Share Your Story
          </Link>
        </div>
      </div>
    </div>
  );
}
