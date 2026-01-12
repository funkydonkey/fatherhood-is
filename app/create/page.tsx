import Link from 'next/link';
import { CreatePostForm } from '@/components/CreatePostForm';
import { ExampleTexts } from '@/components/ExampleTexts';

export const metadata = {
  title: 'Share Your Story | Fatherhood Is',
  description: 'Share what fatherhood means to you and get a beautiful AI-generated illustration',
};

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              <svg
                className="h-5 w-5"
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
            <h1 className="text-2xl font-bold text-gray-900">
              Fatherhood Is...
            </h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">
            Share Your Story
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Tell us what fatherhood means to you, and we&apos;ll create a
            beautiful illustration in the style of &quot;Love Is...&quot; comics
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <CreatePostForm />
        </div>

        {/* Examples */}
        <ExampleTexts />
      </main>
    </div>
  );
}
