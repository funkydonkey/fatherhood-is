"""Rate limiting middleware to prevent spam"""

from datetime import datetime, timedelta
from collections import defaultdict
from typing import Dict, List
from fastapi import Request, HTTPException, status


class RateLimiter:
    """
    Simple IP-based rate limiter

    Tracks requests per IP address within a sliding time window
    """

    def __init__(self, max_requests: int = 10, window_minutes: int = 60):
        """
        Initialize rate limiter

        Args:
            max_requests: Maximum number of requests allowed per window
            window_minutes: Time window in minutes
        """
        self.max_requests = max_requests
        self.window = timedelta(minutes=window_minutes)
        self.requests: Dict[str, List[datetime]] = defaultdict(list)

    def is_allowed(self, ip: str) -> bool:
        """
        Check if a request from this IP is allowed

        Args:
            ip: Client IP address

        Returns:
            True if request is allowed, False if rate limit exceeded
        """
        now = datetime.now()
        window_start = now - self.window

        # Clean up old requests outside the current window
        self.requests[ip] = [
            req_time for req_time in self.requests[ip] if req_time > window_start
        ]

        # Check if limit exceeded
        if len(self.requests[ip]) >= self.max_requests:
            return False

        # Record this request
        self.requests[ip].append(now)
        return True

    def get_remaining_requests(self, ip: str) -> int:
        """
        Get number of remaining requests for this IP

        Args:
            ip: Client IP address

        Returns:
            Number of requests remaining in current window
        """
        now = datetime.now()
        window_start = now - self.window

        # Count requests in current window
        current_requests = [
            req_time for req_time in self.requests[ip] if req_time > window_start
        ]

        return max(0, self.max_requests - len(current_requests))

    def get_reset_time(self, ip: str) -> datetime:
        """
        Get time when rate limit will reset for this IP

        Args:
            ip: Client IP address

        Returns:
            Datetime when oldest request will expire
        """
        if not self.requests[ip]:
            return datetime.now()

        oldest_request = min(self.requests[ip])
        return oldest_request + self.window


# Global rate limiter instances
# Different limits for different operations

# Post creation: 10 posts per hour per IP
post_creation_limiter = RateLimiter(max_requests=10, window_minutes=60)

# General API: 100 requests per hour per IP
general_api_limiter = RateLimiter(max_requests=100, window_minutes=60)


def get_client_ip(request: Request) -> str:
    """
    Extract client IP address from request

    Handles proxies and load balancers by checking headers

    Args:
        request: FastAPI Request object

    Returns:
        Client IP address
    """
    # Check X-Forwarded-For header (set by proxies)
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        # X-Forwarded-For can contain multiple IPs, use the first one
        return forwarded_for.split(",")[0].strip()

    # Check X-Real-IP header (set by some proxies)
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip

    # Fallback to direct client IP
    return request.client.host if request.client else "unknown"


async def rate_limit_post_creation(request: Request):
    """
    Rate limit middleware for post creation

    Raises:
        HTTPException: 429 if rate limit exceeded
    """
    client_ip = get_client_ip(request)

    if not post_creation_limiter.is_allowed(client_ip):
        reset_time = post_creation_limiter.get_reset_time(client_ip)
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={
                "error": "Rate limit exceeded",
                "message": "You have exceeded the maximum number of posts per hour (10). Please try again later.",
                "reset_at": reset_time.isoformat(),
            },
        )


async def rate_limit_general_api(request: Request):
    """
    Rate limit middleware for general API access

    Raises:
        HTTPException: 429 if rate limit exceeded
    """
    client_ip = get_client_ip(request)

    if not general_api_limiter.is_allowed(client_ip):
        reset_time = general_api_limiter.get_reset_time(client_ip)
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={
                "error": "Rate limit exceeded",
                "message": "Too many requests. Please slow down.",
                "reset_at": reset_time.isoformat(),
            },
        )
