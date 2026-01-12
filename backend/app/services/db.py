"""Database service for Supabase"""

from supabase import create_client, Client
from typing import Optional
from app.config import settings


# Singleton Supabase client
_supabase_client: Optional[Client] = None


def get_supabase_client() -> Client:
    """
    Get or create Supabase client singleton

    Returns:
        Supabase client instance
    """
    global _supabase_client

    if _supabase_client is None:
        _supabase_client = create_client(
            settings.supabase_url,
            settings.supabase_key,  # Using service role key for backend
        )

    return _supabase_client
