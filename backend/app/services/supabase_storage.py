"""Supabase Storage service for image uploads"""

import uuid
from typing import Optional
from supabase import Client
from app.config import settings


class SupabaseStorageService:
    """Service for uploading and managing images in Supabase Storage"""

    def __init__(self, supabase_client: Client):
        self.client = supabase_client
        self.bucket_name = "fatherhood-images"

        # Construct public URL base
        # Format: https://<project-ref>.supabase.co/storage/v1/object/public/<bucket>/<filename>
        self.public_url_base = f"{settings.supabase_url}/storage/v1/object/public/{self.bucket_name}"

    async def upload_image(
        self, image_bytes: bytes, filename: Optional[str] = None
    ) -> str:
        """
        Upload image to Supabase Storage

        Args:
            image_bytes: Image data as bytes
            filename: Optional custom filename (will generate UUID if not provided)

        Returns:
            Public URL of the uploaded image

        Raises:
            RuntimeError: If upload fails
        """
        try:
            # Generate filename if not provided
            if not filename:
                filename = f"{uuid.uuid4()}.png"

            # Ensure .png extension
            if not filename.endswith(".png"):
                filename = f"{filename}.png"

            # Upload to Supabase Storage
            response = self.client.storage.from_(self.bucket_name).upload(
                path=filename,
                file=image_bytes,
                file_options={
                    "content-type": "image/png",
                    "cache-control": "3600",  # Cache for 1 hour
                    "upsert": "false",  # Don't overwrite existing files
                },
            )

            # Construct public URL
            public_url = f"{self.public_url_base}/{filename}"

            return public_url

        except Exception as e:
            raise RuntimeError(f"Failed to upload image to Supabase: {str(e)}") from e

    async def delete_image(self, filename: str) -> bool:
        """
        Delete image from Supabase Storage

        Args:
            filename: Filename to delete

        Returns:
            True if deleted successfully

        Raises:
            RuntimeError: If deletion fails
        """
        try:
            self.client.storage.from_(self.bucket_name).remove([filename])
            return True
        except Exception as e:
            raise RuntimeError(f"Failed to delete image from Supabase: {str(e)}") from e

    def get_filename_from_url(self, url: str) -> str:
        """
        Extract filename from public URL

        Args:
            url: Full public URL

        Returns:
            Filename
        """
        return url.split("/")[-1]


# Singleton instance
_supabase_storage_service: Optional[SupabaseStorageService] = None


def get_supabase_storage_service() -> SupabaseStorageService:
    """Get or create the SupabaseStorageService singleton instance"""
    global _supabase_storage_service
    if _supabase_storage_service is None:
        from app.services.db import get_supabase_client

        supabase_client = get_supabase_client()
        _supabase_storage_service = SupabaseStorageService(supabase_client)
    return _supabase_storage_service
