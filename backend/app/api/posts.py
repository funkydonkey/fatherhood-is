"""Posts API endpoints"""

from fastapi import APIRouter, HTTPException, status, Request, Depends
from app.models import PostCreate, PostSave, PostResponse, PostsListResponse, PaginationInfo, ImageGenerationResponse
from app.services import get_image_generator, get_storage_service, get_supabase_client
from app.utils import validate_post_text, validate_author_name, sanitize_text, sanitize_author_name
from app.middleware.rate_limiter import rate_limit_post_creation
from typing import Optional
import math

router = APIRouter(prefix="/api/posts", tags=["posts"])


@router.post("/generate", response_model=ImageGenerationResponse, status_code=status.HTTP_200_OK)
async def generate_image(
    post_data: PostCreate, request: Request, _: None = Depends(rate_limit_post_creation)
):
    """
    Generate an image without saving to database

    Process:
    1. Validate input
    2. Generate image using Google Gemini Imagen
    3. Upload image to R2
    4. Return image URL and data (without saving to DB)
    """
    # Validate text
    is_valid, error = validate_post_text(post_data.text)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error)

    # Validate author name if provided
    if post_data.author_name:
        is_valid, error = validate_author_name(post_data.author_name)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error)

    # Sanitize inputs
    clean_text = sanitize_text(post_data.text)
    clean_author = sanitize_author_name(post_data.author_name)

    try:
        # 1. Generate image
        image_generator = get_image_generator()
        image_bytes = await image_generator.generate_fatherhood_image(clean_text)

        # 2. Upload to R2
        storage = get_storage_service()
        image_url = await storage.upload_image(image_bytes)

        # 3. Return image URL and data (no DB save)
        return ImageGenerationResponse(
            image_url=image_url,
            text=clean_text,
            author_name=clean_author,
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error generating image: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate image")


@router.post("", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(post_data: PostSave):
    """
    Save a post with pre-generated image to database

    Process:
    1. Validate input
    2. Save post to database
    3. Return created post

    Note: Image should be generated first using /api/generate endpoint
    """
    # Validate text
    is_valid, error = validate_post_text(post_data.text)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error)

    # Validate author name if provided
    if post_data.author_name:
        is_valid, error = validate_author_name(post_data.author_name)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error)

    # Sanitize inputs
    clean_text = sanitize_text(post_data.text)
    clean_author = sanitize_author_name(post_data.author_name)

    try:
        # Save to database
        supabase = get_supabase_client()
        result = (
            supabase.table("posts")
            .insert(
                {
                    "text": clean_text,
                    "image_url": post_data.image_url,
                    "author_name": clean_author,
                }
            )
            .execute()
        )

        if not result.data:
            raise HTTPException(
                status_code=500, detail="Failed to save post to database"
            )

        # Return created post
        post = result.data[0]
        return PostResponse(
            id=post["id"],
            text=post["text"],
            image_url=post["image_url"],
            author_name=post.get("author_name"),
            likes_count=post.get("likes_count", 0),
            comments_count=post.get("comments_count", 0),
            created_at=post["created_at"],
        )

    except HTTPException:
        raise
    except Exception as e:
        # Log error in production
        print(f"Error creating post: {e}")
        raise HTTPException(status_code=500, detail="Failed to create post")


@router.get("", response_model=PostsListResponse)
async def get_posts(
    page: int = 1,
    limit: int = 20,
    sort: str = "newest",
):
    """
    Get paginated list of posts

    Query Parameters:
    - page: Page number (default: 1)
    - limit: Posts per page (default: 20, max: 50)
    - sort: Sort order - newest | oldest | popular (default: newest)
    """
    # Validate pagination params
    if page < 1:
        raise HTTPException(status_code=400, detail="Page must be >= 1")

    if limit < 1 or limit > 50:
        raise HTTPException(
            status_code=400, detail="Limit must be between 1 and 50"
        )

    if sort not in ["newest", "oldest", "popular"]:
        raise HTTPException(
            status_code=400, detail="Sort must be one of: newest, oldest, popular"
        )

    try:
        supabase = get_supabase_client()

        # Determine sort order
        if sort == "newest":
            order_by = "created_at.desc"
        elif sort == "oldest":
            order_by = "created_at.asc"
        else:  # popular
            order_by = "likes_count.desc"

        # Calculate offset
        offset = (page - 1) * limit

        # Get total count
        count_result = (
            supabase.table("posts")
            .select("*", count="exact")
            .eq("is_published", True)
            .execute()
        )
        total_count = count_result.count or 0

        # Get posts
        result = (
            supabase.table("posts")
            .select("*")
            .eq("is_published", True)
            .order(order_by.split(".")[0], desc=(order_by.split(".")[1] == "desc"))
            .range(offset, offset + limit - 1)
            .execute()
        )

        posts = [
            PostResponse(
                id=post["id"],
                text=post["text"],
                image_url=post["image_url"],
                author_name=post.get("author_name"),
                likes_count=post.get("likes_count", 0),
                comments_count=post.get("comments_count", 0),
                created_at=post["created_at"],
            )
            for post in result.data
        ]

        # Calculate pagination info
        total_pages = math.ceil(total_count / limit)

        return PostsListResponse(
            posts=posts,
            pagination=PaginationInfo(
                page=page,
                limit=limit,
                total=total_count,
                pages=total_pages,
            ),
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching posts: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch posts")


@router.get("/{post_id}", response_model=PostResponse)
async def get_post(post_id: str):
    """
    Get a specific post by ID
    """
    try:
        supabase = get_supabase_client()

        result = (
            supabase.table("posts")
            .select("*")
            .eq("id", post_id)
            .eq("is_published", True)
            .execute()
        )

        if not result.data:
            raise HTTPException(status_code=404, detail="Post not found")

        post = result.data[0]

        return PostResponse(
            id=post["id"],
            text=post["text"],
            image_url=post["image_url"],
            author_name=post.get("author_name"),
            likes_count=post.get("likes_count", 0),
            comments_count=post.get("comments_count", 0),
            created_at=post["created_at"],
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching post: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch post")
