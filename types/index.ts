/**
 * Frontend-only types for API communication with Python backend
 */

/**
 * Post from API response
 */
export interface Post {
  id: string;
  text: string;
  image_url: string;
  author_name: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

/**
 * Request to generate an image (without saving to DB)
 */
export interface CreatePostRequest {
  text: string;
  author_name?: string;
}

/**
 * Response from image generation
 */
export interface ImageGenerationResponse {
  image_url: string;
  text: string;
  author_name: string | null;
}

/**
 * Request to save a post with pre-generated image
 */
export interface SavePostRequest {
  text: string;
  author_name?: string;
  image_url: string;
}

/**
 * Paginated posts response
 */
export interface PostsListResponse {
  posts: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * API error response
 */
export interface ApiError {
  error: string;
  detail?: string;
}

/**
 * Comment from API response
 */
export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Request to create a comment
 */
export interface CreateCommentRequest {
  post_id: string;
  user_id: string;
  content: string;
}

/**
 * Paginated comments response
 */
export interface CommentsListResponse {
  comments: Comment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * User profile
 */
export interface User {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}
