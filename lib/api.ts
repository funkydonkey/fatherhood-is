/**
 * API client for communicating with Python FastAPI backend
 */

import type {
  Post,
  PostsListResponse,
  CreatePostRequest,
  ImageGenerationResponse,
  SavePostRequest,
  Comment,
  CommentsListResponse,
  CreateCommentRequest,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Fetch all posts with pagination
 */
export async function getPosts(
  page: number = 1,
  limit: number = 20,
  sort: 'newest' | 'oldest' | 'popular' = 'newest'
): Promise<PostsListResponse> {
  const url = new URL(`${API_URL}/api/posts`);
  url.searchParams.set('page', page.toString());
  url.searchParams.set('limit', limit.toString());
  url.searchParams.set('sort', sort);

  const response = await fetch(url.toString(), {
    next: { revalidate: 0 }, // Always fetch fresh data
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch a single post by ID
 */
export async function getPost(id: string): Promise<Post> {
  const response = await fetch(`${API_URL}/api/posts/${id}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Post not found');
    }
    throw new Error(`Failed to fetch post: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Generate an image without saving to database
 */
export async function generateImage(data: CreatePostRequest): Promise<ImageGenerationResponse> {
  const response = await fetch(`${API_URL}/api/posts/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));

    // Handle rate limiting (429) with detailed error message
    if (response.status === 429 && error.detail) {
      const message = typeof error.detail === 'string'
        ? error.detail
        : error.detail.message || 'Too many requests. Please try again later.';
      throw new Error(message);
    }

    throw new Error(error.error || error.detail || 'Failed to generate image');
  }

  return response.json();
}

/**
 * Save a post with pre-generated image
 */
export async function savePost(data: SavePostRequest): Promise<Post> {
  const response = await fetch(`${API_URL}/api/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || error.detail || 'Failed to save post');
  }

  return response.json();
}

/**
 * @deprecated Use generateImage() and savePost() separately for better UX
 * Create a new post (old API - generates and saves in one call)
 */
export async function createPost(data: CreatePostRequest): Promise<Post> {
  const response = await fetch(`${API_URL}/api/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));

    // Handle rate limiting (429) with detailed error message
    if (response.status === 429 && error.detail) {
      const message = typeof error.detail === 'string'
        ? error.detail
        : error.detail.message || 'Too many requests. Please try again later.';
      throw new Error(message);
    }

    throw new Error(error.error || error.detail || 'Failed to create post');
  }

  return response.json();
}

/**
 * Get comments for a post
 */
export async function getComments(
  postId: string,
  page: number = 1,
  limit: number = 20
): Promise<CommentsListResponse> {
  const url = new URL(`${API_URL}/api/comments/post/${postId}`);
  url.searchParams.set('page', page.toString());
  url.searchParams.set('limit', limit.toString());

  const response = await fetch(url.toString(), {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch comments: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Create a new comment
 */
export async function createComment(data: CreateCommentRequest): Promise<Comment> {
  const response = await fetch(`${API_URL}/api/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || error.detail || 'Failed to create comment');
  }

  return response.json();
}

/**
 * Delete a comment (soft delete)
 */
export async function deleteComment(commentId: string, userId: string): Promise<void> {
  const url = new URL(`${API_URL}/api/comments/${commentId}`);
  url.searchParams.set('user_id', userId);

  const response = await fetch(url.toString(), {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || error.detail || 'Failed to delete comment');
  }
}
