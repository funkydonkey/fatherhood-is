"""Storage service for Cloudflare R2 (S3-compatible) with local fallback"""

import boto3
from botocore.client import Config
from typing import Optional
import uuid
import os
from app.config import settings


class LocalStorageService:
    """Local file storage for development when R2 is not configured"""

    def __init__(self):
        self.upload_dir = "uploads"
        os.makedirs(self.upload_dir, exist_ok=True)

        # Determine base URL based on environment
        if settings.backend_url:
            # Use explicitly configured backend URL (for production)
            self.base_url = settings.backend_url
        elif settings.is_production:
            # Fallback: try RENDER_EXTERNAL_URL env var
            self.base_url = os.getenv("RENDER_EXTERNAL_URL", "http://localhost:8000")
        else:
            # Development: use local server
            self.base_url = f"http://{settings.api_host}:{settings.api_port}"

    async def upload_image(
        self, image_bytes: bytes, filename: Optional[str] = None
    ) -> str:
        """Save image locally"""
        if not filename:
            filename = f"{uuid.uuid4()}.png"
        if not filename.endswith(".png"):
            filename = f"{filename}.png"

        file_path = f"{self.upload_dir}/{filename}"
        with open(file_path, "wb") as f:
            f.write(image_bytes)

        return f"{self.base_url}/uploads/{filename}"

    async def delete_image(self, filename: str) -> bool:
        """Delete local image"""
        try:
            file_path = f"{self.upload_dir}/{filename}"
            if os.path.exists(file_path):
                os.remove(file_path)
            return True
        except Exception:
            return False

    def get_filename_from_url(self, url: str) -> str:
        """Extract filename from URL"""
        return url.split("/")[-1]


class StorageService:
    """
    Service for uploading and managing images in Cloudflare R2
    Automatically falls back to local storage if R2 is not configured
    """

    def __init__(self):
        # Check if R2 is fully configured
        self.use_local = not settings.use_r2_storage

        if self.use_local:
            print("⚠️  R2 not configured, using local file storage")
            self.local_service = LocalStorageService()
        else:
            print("✓ Using Cloudflare R2 storage")
            # Configure S3 client for R2
            self.s3_client = boto3.client(
                "s3",
                endpoint_url=settings.r2_endpoint_url,
                aws_access_key_id=settings.r2_access_key_id,
                aws_secret_access_key=settings.r2_secret_access_key,
                config=Config(signature_version="s3v4"),
                region_name="auto",  # R2 uses 'auto' for region
            )
            self.bucket_name = settings.r2_bucket_name
            self.public_url = settings.r2_public_url

    async def upload_image(
        self, image_bytes: bytes, filename: Optional[str] = None
    ) -> str:
        """
        Upload image to R2 (or local storage if R2 not configured)

        Args:
            image_bytes: Image data as bytes
            filename: Optional custom filename (will generate UUID if not provided)

        Returns:
            Public URL of the uploaded image

        Raises:
            RuntimeError: If upload fails
        """
        # Use local storage if R2 not configured
        if self.use_local:
            return await self.local_service.upload_image(image_bytes, filename)

        try:
            # Generate filename if not provided
            if not filename:
                filename = f"{uuid.uuid4()}.png"

            # Ensure .png extension
            if not filename.endswith(".png"):
                filename = f"{filename}.png"

            # Upload to R2
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=filename,
                Body=image_bytes,
                ContentType="image/png",
                CacheControl="public, max-age=31536000",  # Cache for 1 year
            )

            # Construct public URL
            public_url = f"{self.public_url}/{filename}"

            return public_url

        except Exception as e:
            raise RuntimeError(f"Failed to upload image: {str(e)}") from e

    async def delete_image(self, filename: str) -> bool:
        """
        Delete image from R2 (or local storage)

        Args:
            filename: Filename to delete

        Returns:
            True if deleted successfully

        Raises:
            RuntimeError: If deletion fails
        """
        # Use local storage if R2 not configured
        if self.use_local:
            return await self.local_service.delete_image(filename)

        try:
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=filename)
            return True
        except Exception as e:
            raise RuntimeError(f"Failed to delete image: {str(e)}") from e

    def get_filename_from_url(self, url: str) -> str:
        """
        Extract filename from public URL

        Args:
            url: Full public URL

        Returns:
            Filename
        """
        if self.use_local:
            return self.local_service.get_filename_from_url(url)

        return url.replace(f"{self.public_url}/", "")


# Singleton instance
_storage_service: Optional[StorageService] = None


def get_storage_service() -> StorageService:
    """Get or create the StorageService singleton instance"""
    global _storage_service
    if _storage_service is None:
        _storage_service = StorageService()
    return _storage_service
