import time
from typing import Any, Dict, Tuple

class TTLCache:
    def __init__(self, ttl_seconds: int = 60, max_size: int = 512):
        self.ttl = ttl_seconds
        self.max_size = max_size
        self.store: Dict[str, Tuple[float, Any]] = {}

    def get(self, key: str):
        now = time.time()
        item = self.store.get(key)
        if not item:
            return None
        ts, val = item
        if now - ts > self.ttl:
            self.store.pop(key, None)
            return None
        return val

    def set(self, key: str, value: Any):
        if len(self.store) >= self.max_size:
            # naive eviction: clear half
            for k in list(self.store.keys())[: self.max_size // 2]:
                self.store.pop(k, None)
        self.store[key] = (time.time(), value)

products_cache = TTLCache(ttl_seconds=120)
filters_cache = TTLCache(ttl_seconds=300)
search_cache = TTLCache(ttl_seconds=120)

