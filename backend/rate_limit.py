import os
from upstash_redis import Redis
from dotenv import load_dotenv

load_dotenv()

redis_client = Redis(
    url=os.getenv("UPSTASH_REDIS_REST_URL"),
    token=os.getenv("UPSTASH_REDIS_REST_TOKEN"),
) 

SCAN_LIMIT = int(os.getenv("SCAN_LIMIT", "5"))
WINDOW_SECONDS = int(os.getenv("RATE_LIMIT_WINDOW_SECONDS", "3600"))

class RateLimitExceeded(Exception):
    def __init__(self, retry_after: int):
        self.retry_after = retry_after
        super().__init__(f"Rate limit exceeded. Try again in {retry_after} seconds.")


def check_rate_limit(client_ip: str) -> None:
    """
    Fixed-window rate limiter: each IP gets SCAN_LIMIT requests per
    WINDOW_SECONDS. Raises RateLimitExceeded if the caller is over budget.
    """
    key = f"ratelimit:scan:{client_ip}"

    current_count = redis_client.incr(key)

    if current_count == 1:
        # first request in this window — set the expiry
        redis_client.expire(key, WINDOW_SECONDS)

    if current_count > SCAN_LIMIT:
        ttl = redis_client.ttl(key)
        raise RateLimitExceeded(retry_after=max(ttl, 1))