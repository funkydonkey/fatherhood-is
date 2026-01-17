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


# Global settings instance
settings = Settings()
