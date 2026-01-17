"""Storage service using Supabase Storage"""

from typing import Optional
from app.services.supabase_storage import (
    SupabaseStorageService,
    get_supabase_storage_service,
)


class StorageService:
    """
    Wrapper service for Supabase Storage
    Maintains compatibility with existing code
    """

    def __init__(self):
        print("✓ Using Supabase Storage")
        self.supabase_storage = get_supabase_storage_service()

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
        return await self.supabase_storage.upload_image(image_bytes, filename)

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
        return await self.supabase_storage.delete_image(filename)

    def get_filename_from_url(self, url: str) -> str:
        """
        Extract filename from public URL

        Args:
            url: Full public URL

        Returns:
            Filename
        """
        return self.supabase_storage.get_filename_from_url(url)


# Singleton instance
_storage_service: Optional[StorageService] = None


def get_storage_service() -> StorageService:
    """Get or create the StorageService singleton instance"""
    global _storage_service
    if _storage_service is None:
        _storage_service = StorageService()
    return _storage_service
