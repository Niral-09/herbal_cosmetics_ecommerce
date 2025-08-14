import os
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from decimal import Decimal

os.environ.setdefault(
    "DATABASE_URL",
    os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/herbal_cosmetics_db",
    ),
)
DATABASE_URL = os.environ["DATABASE_URL"]

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

from app.models.category import Category
from app.models.product import Product, ProductStatus
from app.models.product_image import ProductImage, ImageType
from app.models.product_variant import ProductVariant
from app.models.product_category import ProductCategory
from app.models.user import User, UserRole
from app.utils.security import get_password_hash
from app.models.order import Order, OrderItem, OrderStatus

from app.utils.helpers import slugify

CATEGORIES = [
    ("Hair Care", None),
    ("Shampoos", "Hair Care"),
    ("Conditioners", "Hair Care"),
    ("Skin Care", None),
    ("Moisturizers", "Skin Care"),
]

PRODUCTS = [
    {
        "name": "Herbal Anti-Dandruff Shampoo",
        "category": "Shampoos",
        "brand": "HerbalCo",
        "base_price": Decimal("299.00"),
        "short_description": "Soothing herbal formula",
        "detailed_description": "Herbal actives reduce dandruff and soothe scalp.",
        "weight": Decimal("0.25"),
        "tags": ["hair", "dandruff", "shampoo"],
        "images": [
            {"url": "/static/demo/shampoo1.jpg", "alt": "Shampoo Bottle"},
        ],
        "variants": [
            {
                "title": "200ml",
                "sku": "HCS-SHA-200",
                "price": Decimal("299.00"),
                "inventory": 50,
            },
            {
                "title": "500ml",
                "sku": "HCS-SHA-500",
                "price": Decimal("599.00"),
                "inventory": 25,
            },
        ],
    },
    {
        "name": "Aloe Moisturizing Cream",
        "category": "Moisturizers",
        "brand": "HerbalCo",
        "base_price": Decimal("399.00"),
        "short_description": "Hydrating aloe formula",
        "detailed_description": "Deep hydration for dry skin.",
        "weight": Decimal("0.15"),
        "tags": ["skin", "moisturizer"],
        "images": [
            {"url": "/static/demo/moist1.jpg", "alt": "Moisturizer Jar"},
        ],
        "variants": [
            {
                "title": "50g",
                "sku": "HCS-MOI-050",
                "price": Decimal("399.00"),
                "inventory": 40,
            },
            {
                "title": "100g",
                "sku": "HCS-MOI-100",
                "price": Decimal("699.00"),
                "inventory": 20,
            },
        ],
    },
]

USERS = [
    {
        "email": "admin@herbalcosmetics.com",
        "password": "Admin@123",
        "first_name": "Admin",
        "last_name": "User",
        "role": UserRole.admin,
    },
    {
        "email": "customer1@example.com",
        "password": "Pass@1234",
        "first_name": "Alice",
        "last_name": "Doe",
        "role": UserRole.customer,
    },
    {
        "email": "customer2@example.com",
        "password": "Pass@1234",
        "first_name": "Bob",
        "last_name": "Smith",
        "role": UserRole.customer,
    },
]

ORDER_STATUSES = [
    OrderStatus.pending,
    OrderStatus.confirmed,
    OrderStatus.processing,
    OrderStatus.shipped,
    OrderStatus.delivered,
    OrderStatus.cancelled,
    OrderStatus.refunded,
]


def get_or_create(session, model, defaults=None, **kwargs):
    instance = session.query(model).filter_by(**kwargs).first()
    if instance:
        return instance, False
    params = dict((k, v) for k, v in kwargs.items())
    if defaults:
        params.update(defaults)
    instance = model(**params)
    session.add(instance)
    session.commit()
    session.refresh(instance)
    return instance, True


def seed_categories(session):
    name_to_id = {}
    # Ensure parents first
    for name, parent in CATEGORIES:
        if parent is None:
            slug = slugify(name)
            cat, created = get_or_create(
                session, Category, name=name, defaults={"slug": slug, "full_path": slug}
            )
            cat.set_slug_and_path()
            session.add(cat)
            session.commit()
            name_to_id[name] = cat.id
    for name, parent in CATEGORIES:
        if parent is not None:
            parent_id = name_to_id.get(parent)
            if not parent_id:
                parent_cat = (
                    session.query(Category).filter(Category.name == parent).first()
                )
                parent_id = parent_cat.id
            slug = slugify(name)
            cat, created = get_or_create(
                session,
                Category,
                name=name,
                defaults={"slug": slug, "parent_id": parent_id, "full_path": slug},
            )
            if created:
                cat.parent_id = parent_id
                cat.set_slug_and_path()
                session.add(cat)
                session.commit()
            name_to_id[name] = cat.id
    return name_to_id


def seed_users(session):
    for u in USERS:
        existing = session.query(User).filter(User.email == u["email"]).first()
        if existing:
            continue
        user = User(
            email=u["email"],
            hashed_password=get_password_hash(u["password"]),
            first_name=u["first_name"],
            last_name=u["last_name"],
            role=u["role"],
            is_active=True,
            email_verified=True,
        )
        session.add(user)
    session.commit()


def seed_products(session, name_to_cat):
    for p in PRODUCTS:
        slug = slugify(p["name"])
        prod = session.query(Product).filter(Product.slug == slug).first()
        if prod:
            continue
        prod = Product(
            name=p["name"],
            slug=slug,
            category_id=name_to_cat.get(p["category"]),
            brand=p["brand"],
            base_price=p["base_price"],
            short_description=p["short_description"],
            detailed_description=p["detailed_description"],
            weight=p["weight"],
            tags=p["tags"],
            is_active=True,
        )
        session.add(prod)
        session.commit()
        session.refresh(prod)
        for i, im in enumerate(p["images"]):
            session.add(
                ProductImage(
                    product_id=prod.id,
                    image_url=im["url"],
                    alt_text=im["alt"],
                    sort_order=i,
                )
            )
        session.commit()
        for i, v in enumerate(p["variants"]):
            session.add(
                ProductVariant(
                    product_id=prod.id,
                    title=v["title"],
                    sku=v["sku"],
                    price=v["price"],
                    inventory_quantity=v["inventory"],
                    sort_order=i,
                    is_active=True,
                )
            )
        session.commit()
    return True


def seed_orders(session):
    # pick a customer and create one order per status
    customer = session.query(User).filter(User.role == UserRole.customer).first()
    prod = session.query(Product).first()
    variant = (
        session.query(ProductVariant)
        .filter(ProductVariant.product_id == prod.id)
        .first()
    )
    if not customer or not prod or not variant:
        return
    for st in ORDER_STATUSES:
        # skip if already exists
        if (
            session.query(Order)
            .filter(Order.customer_email == customer.email, Order.status == st)
            .first()
        ):
            continue
        order = Order(
            order_number=f"HC-{datetime.utcnow().strftime('%Y%m%d')}-{int(datetime.utcnow().timestamp())%10000:04d}-{st.value}",
            user_id=customer.id,
            customer_email=customer.email,
            customer_phone="9999999999",
            subtotal=variant.price,
            shipping_amount=Decimal("30.00"),
            total_amount=Decimal(variant.price) + Decimal("30.00"),
            status=st,
        )
        session.add(order)
        session.commit()
        session.refresh(order)
        item = OrderItem(
            order_id=order.id,
            product_id=prod.id,
            variant_id=variant.id,
            product_name=prod.name,
            variant_title=variant.title,
            sku=variant.sku,
            quantity=1,
            unit_price=variant.price,
            total_price=variant.price,
        )
        session.add(item)
        session.commit()


def main():
    session = SessionLocal()
    try:
        cats = seed_categories(session)
        seed_users(session)
        seed_products(session, cats)
        seed_orders(session)
        print("Seed complete")
    finally:
        session.close()


if __name__ == "__main__":
    main()
