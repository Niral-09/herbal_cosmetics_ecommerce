from app.core.database import Base
from sqlalchemy import MetaData

# Import models so that Alembic can detect them
from .user import User  # noqa
from .address import Address  # noqa
from .refresh_token import RefreshToken  # noqa
from .category import Category  # noqa
from .product import Product  # noqa
from .product_image import ProductImage  # noqa
from .product_variant import ProductVariant  # noqa
from .product_category import ProductCategory  # noqa

__all_models_metadata__: list[MetaData] = [Base.metadata]

