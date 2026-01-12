"""Comments API endpoints"""

from fastapi import APIRouter, HTTPException, status, Request
from app.models import (
    CommentCreate,
    CommentUpdate,
    CommentResponse,
    CommentsListResponse,
    CommentPaginationInfo,
)
from app.services import get_supabase_client
from typing import Optional
import math

router = APIRouter(prefix="/api/comments", tags=["comments"])


@router.get("/post/{post_id}", response_model=CommentsListResponse)
async def get_post_comments(
    post_id: str,
    page: int = 1,
    limit: int = 20,
):
    """
    Get comments for a specific post with pagination

    Query Parameters:
    - page: Page number (default: 1)
    - limit: Comments per page (default: 20, max: 50)
    """
    # Validate pagination params
    if page < 1:
        raise HTTPException(status_code=400, detail="Page must be >= 1")

    if limit < 1 or limit > 50:
        raise HTTPException(
            status_code=400, detail="Limit must be between 1 and 50"
        )

    try:
        supabase = get_supabase_client()

        # Calculate offset
        offset = (page - 1) * limit

        # Get total count
        count_result = (
            supabase.table("comments")
            .select("*", count="exact")
            .eq("post_id", post_id)
            .eq("is_deleted", False)
            .execute()
        )
        total_count = count_result.count or 0

        # Get comments with user info (join with users table)
        result = (
            supabase.table("comments")
            .select("*, users(username, display_name, avatar_url)")
            .eq("post_id", post_id)
            .eq("is_deleted", False)
            .order("created_at", desc=False)  # Oldest first
            .range(offset, offset + limit - 1)
            .execute()
        )

        # Transform data
        comments = []
        for comment in result.data:
            user_data = comment.get("users", {}) or {}
            comments.append(
                CommentResponse(
                    id=comment["id"],
                    post_id=comment["post_id"],
                    user_id=comment["user_id"],
                    content=comment["content"],
                    username=user_data.get("username", "Anonymous"),
                    display_name=user_data.get("display_name"),
                    avatar_url=user_data.get("avatar_url"),
                    is_deleted=comment.get("is_deleted", False),
                    created_at=comment["created_at"],
                    updated_at=comment["updated_at"],
                )
            )

        # Calculate pagination info
        total_pages = math.ceil(total_count / limit)

        return CommentsListResponse(
            comments=comments,
            pagination=CommentPaginationInfo(
                page=page,
                limit=limit,
                total=total_count,
                pages=total_pages,
            ),
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching comments: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch comments")


@router.post("", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
async def create_comment(comment_data: CommentCreate):
    """
    Create a new comment

    Note: In production, user_id should come from authenticated session
    For MVP, we accept it in the request body
    """
    try:
        supabase = get_supabase_client()

        # Insert comment
        result = (
            supabase.table("comments")
            .insert(
                {
                    "post_id": str(comment_data.post_id),
                    "user_id": str(comment_data.user_id),
                    "content": comment_data.content,
                }
            )
            .execute()
        )

        if not result.data:
            raise HTTPException(
                status_code=500, detail="Failed to create comment"
            )

        comment = result.data[0]

        # Get user data
        user_result = (
            supabase.table("users")
            .select("username, display_name, avatar_url")
            .eq("id", comment["user_id"])
            .execute()
        )

        user_data = user_result.data[0] if user_result.data else {}

        return CommentResponse(
            id=comment["id"],
            post_id=comment["post_id"],
            user_id=comment["user_id"],
            content=comment["content"],
            username=user_data.get("username", "Anonymous"),
            display_name=user_data.get("display_name"),
            avatar_url=user_data.get("avatar_url"),
            is_deleted=comment.get("is_deleted", False),
            created_at=comment["created_at"],
            updated_at=comment["updated_at"],
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating comment: {e}")
        raise HTTPException(status_code=500, detail="Failed to create comment")


@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(comment_id: str, user_id: str):
    """
    Soft delete a comment (set is_deleted = true)

    Note: In production, user_id should come from authenticated session
    For MVP, we accept it as query parameter
    """
    try:
        supabase = get_supabase_client()

        # Verify comment exists and belongs to user
        comment_result = (
            supabase.table("comments")
            .select("*")
            .eq("id", comment_id)
            .eq("user_id", user_id)
            .execute()
        )

        if not comment_result.data:
            raise HTTPException(
                status_code=404,
                detail="Comment not found or you don't have permission to delete it",
            )

        # Soft delete
        result = (
            supabase.table("comments")
            .update({"is_deleted": True})
            .eq("id", comment_id)
            .execute()
        )

        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to delete comment")

        return None

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting comment: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete comment")
