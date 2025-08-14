import time
from collections import defaultdict, deque
from fastapi import HTTPException, status

# Simple in-memory sliding window limiter (dev use only)
class RateLimiter:
    def __init__(self, max_calls: int, per_seconds: int):
        self.max_calls = max_calls
        self.per_seconds = per_seconds
        self.hits: dict[str, deque[float]] = defaultdict(deque)

    def check(self, key: str):
        now = time.time()
        q = self.hits[key]
        while q and now - q[0] > self.per_seconds:
            q.popleft()
        if len(q) >= self.max_calls:
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many requests, try again later")
        q.append(now)

auth_limiter = RateLimiter(max_calls=5, per_seconds=60)
email_limiter = RateLimiter(max_calls=3, per_seconds=3600)

