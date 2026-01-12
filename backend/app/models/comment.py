"""Pydantic models for Comments"""

from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Optional
from uuid import UUID


class CommentBase(BaseModel):
    """Base Comment model with common fields"""

    content: str = Field(..., min_length=1, max_length=1000)


class CommentCreate(CommentBase):
    """Model for creating a new comment"""

    post_id: UUID
    user_id: UUID

    @field_validator("content")
    @classmethod
    def validate_content(cls, v: str) -> str:
        """Validate content doesn't contain only whitespace"""
        if not v.strip():
            raise ValueError("Comment content cannot be empty")
        return v.strip()


class CommentUpdate(BaseModel):
    """Model for updating a comment"""

    content: Optional[str] = Field(None, min_length=1, max_length=1000)
    is_deleted: Optional[bool] = None


class CommentResponse(CommentBase):
    """Model for comment response"""

    id: UUID
    post_id: UUID
    user_id: UUID
    username: str  # From joined users table
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    is_deleted: bool = False
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CommentsListResponse(BaseModel):
    """Model for paginated comments list"""

    comments: list[CommentResponse]
    pagination: "CommentPaginationInfo"


class CommentPaginationInfo(BaseModel):
    """Pagination metadata for comments"""

    page: int
    limit: int
    total: int
    pages: int
