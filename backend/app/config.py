"""Application configuration using Pydantic Settings"""

from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # Supabase
    supabase_url: str
    supabase_key: str
    supabase_anon_key: str
    database_url: str

    # Google Gemini API for image generation (Imagen)
    google_api_key: str

    # Cloudflare R2
    r2_account_id: str
    r2_access_key_id: str
    r2_secret_access_key: str
    r2_bucket_name: str = "fatherhood-images"
    r2_public_url: str

    # Application
    environment: str = "development"
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    frontend_url: str = "http://localhost:3000"

    # Rate Limiting
    rate_limit_per_hour: int = 10

    @property
    def is_production(self) -> bool:
        return self.environment == "production"

    @property
    def r2_endpoint_url(self) -> str:
        return f"https://{self.r2_account_id}.r2.cloudflarestorage.com"


# Global settings instance
settings = Settings()
