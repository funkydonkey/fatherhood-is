"""Pydantic models for Posts"""

from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Optional
from uuid import UUID


class PostBase(BaseModel):
    """Base Post model with common fields"""

    text: str = Field(..., min_length=3, max_length=280)
    author_name: Optional[str] = Field(None, max_length=100)


class PostCreate(PostBase):
    """Model for creating a new post (for generation)"""

    @field_validator("text")
    @classmethod
    def validate_text_content(cls, v: str) -> str:
        """Validate text doesn't contain only whitespace"""
        if not v.strip():
            raise ValueError("Text cannot be empty")
        return v.strip()

    @field_validator("author_name")
    @classmethod
    def validate_author_name(cls, v: Optional[str]) -> Optional[str]:
        """Validate and sanitize author name"""
        if v is None:
            return None

        cleaned = v.strip()
        if not cleaned:
            return None

        # Check for valid characters (letters, spaces, hyphens, apostrophes)
        import re
        if not re.match(r"^[a-zA-Z\u00C0-\u024F\s'-]+$", cleaned):
            raise ValueError("Author name contains invalid characters")

        return cleaned


class PostSave(PostBase):
    """Model for saving a post with generated image URL"""

    image_url: str = Field(..., min_length=1)


class PostResponse(PostBase):
    """Model for post response"""

    id: UUID
    image_url: str
    likes_count: int = 0
    comments_count: int = 0
    created_at: datetime

    class Config:
        from_attributes = True


class PostsListResponse(BaseModel):
    """Model for paginated posts list"""

    posts: list[PostResponse]
    pagination: "PaginationInfo"


class PaginationInfo(BaseModel):
    """Pagination metadata"""

    page: int
    limit: int
    total: int
    pages: int


class ImageGenerationResponse(BaseModel):
    """Model for image generation response (without saving to DB)"""

    image_url: str
    text: str
    author_name: Optional[str] = None


class PostInDB(PostBase):
    """Full post model as stored in database"""

    id: UUID
    image_url: str
    author_id: Optional[UUID] = None
    likes_count: int = 0
    comments_count: int = 0
    language: str = "en"
    is_published: bool = True
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
