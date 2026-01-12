"""Validation utilities for user input"""

import re
from typing import Optional, Tuple


# List of blocked words for content moderation
BLOCKED_WORDS = [
    "hate",
    "kill",
    "death",
    "violence",
    "abuse",
    "racist",
    "sexist",
    "drug",
    "weapon",
    "terror",
    "nazi",
    "slur",
    # Add more as needed
]


def validate_post_text(text: str) -> Tuple[bool, Optional[str]]:
    """
    Validate post text according to business rules

    Rules:
    - Length: 3-280 characters
    - No blocked words
    - No spam patterns (4+ consecutive repeated characters)
    - Must contain some alphanumeric content

    Args:
        text: User input text

    Returns:
        Tuple of (is_valid, error_message)
    """
    if not text or not isinstance(text, str):
        return False, "Text is required"

    # Trim whitespace
    trimmed = text.strip()

    # Check minimum length
    if len(trimmed) < 3:
        return False, "Text is too short (minimum 3 characters)"

    # Check maximum length
    if len(trimmed) > 280:
        return False, "Text is too long (maximum 280 characters)"

    # Check for blocked words
    text_lower = trimmed.lower()
    for word in BLOCKED_WORDS:
        if word in text_lower:
            return False, "Text contains inappropriate content"

    # Check for spam patterns (4+ repeated characters)
    if re.search(r"(.)\1{4,}", trimmed):
        return False, "Text appears to be spam (too many repeated characters)"

    # Check for excessive whitespace
    if re.search(r"\s{5,}", trimmed):
        return False, "Text contains excessive whitespace"

    # Must contain at least some alphanumeric characters
    if not re.search(r"[a-zA-Z0-9]", trimmed):
        return False, "Text must contain at least some letters or numbers"

    return True, None


def validate_author_name(name: Optional[str]) -> Tuple[bool, Optional[str]]:
    """
    Validate author name (optional field)

    Rules:
    - Length: 1-100 characters if provided
    - Only letters, spaces, hyphens, apostrophes
    - No numbers

    Args:
        name: Author name (optional)

    Returns:
        Tuple of (is_valid, error_message)
    """
    # Author name is optional
    if not name:
        return True, None

    trimmed = name.strip()

    # If provided, must not be empty
    if len(trimmed) == 0:
        return False, "Author name cannot be empty if provided"

    # Check length
    if len(trimmed) > 100:
        return False, "Author name is too long (maximum 100 characters)"

    # Allow only letters, spaces, hyphens, apostrophes, unicode letters
    if not re.match(r"^[a-zA-Z\u00C0-\u024F\s'-]+$", trimmed):
        return False, "Author name contains invalid characters"

    return True, None


def sanitize_text(text: str) -> str:
    """
    Sanitize text by trimming and normalizing whitespace

    Args:
        text: Input text

    Returns:
        Sanitized text
    """
    # Trim and replace multiple spaces with single space
    return re.sub(r"\s+", " ", text.strip())


def sanitize_author_name(name: Optional[str]) -> Optional[str]:
    """
    Sanitize author name

    Args:
        name: Author name

    Returns:
        Sanitized name or None if empty
    """
    if not name:
        return None

    sanitized = re.sub(r"\s+", " ", name.strip())
    return sanitized if sanitized else None
