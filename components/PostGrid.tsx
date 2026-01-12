'use client';

import { useState } from 'react';
import { PostCard } from './PostCard';
import type { Post } from '@/types';

interface PostGridProps {
  initialPosts: Post[];
  initialPage: number;
  totalPages: number;
}

export function PostGrid({ initialPosts, initialPage, totalPages }: PostGridProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);

  const loadPage = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/posts?page=${page}&limit=20&sort=newest`
      );
      const data = await response.json();
      setPosts(data.posts);
      setCurrentPage(page);

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Empty state */}
      {posts.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <svg
            className="mb-4 h-16 w-16 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900">No posts yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Be the first to share what fatherhood means to you!
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {/* Previous button */}
          <button
            onClick={() => loadPage(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show first page, last page, current page, and pages around current
              let pageNumber: number;

              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => loadPage(pageNumber)}
                  disabled={isLoading}
                  className={`min-w-[40px] rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    currentPage === pageNumber
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          {/* Next button */}
          <button
            onClick={() => loadPage(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
        </div>
      )}
    </div>
  );
}
