import re
import uuid
from typing import Iterable

_slug_re = re.compile(r"[^a-z0-9]+")

def slugify(name: str) -> str:
    s = name.strip().lower()
    s = _slug_re.sub("-", s).strip("-")
    return s or str(uuid.uuid4())


def calc_category_path(parent_path: str | None, slug: str) -> tuple[int, str]:
    if parent_path:
        path = f"{parent_path}/{slug}"
        level = parent_path.count("/") + 1
    else:
        path = slug
        level = 0
    return level, path

