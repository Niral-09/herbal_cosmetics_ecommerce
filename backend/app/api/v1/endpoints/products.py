from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
import csv
import io
import uuid
from app.api.deps import get_db_dep, optional_auth, require_admin_role
from app.models.product import Product, ProductStatus
from app.models.product_variant import ProductVariant
from app.models.product_image import ProductImage, ImageType
from app.models.category import Category
from app.models.product_category import ProductCategory
from app.schemas.product import (
    ProductResponse, ProductListResponse, ProductSearchResponse, ProductCreate, ProductUpdate,
    ProductVariantCreate, ProductVariantUpdate, ProductVariantResponse, ProductInventoryUpdate, ProductStatusUpdate,
    ProductImageCreate, ProductImageUpdate, ProductImageResponse
)
from app.utils.helpers import slugify
from app.utils.cache import products_cache, filters_cache, search_cache

router = APIRouter(prefix="/products", tags=["products"])

@router.get("", response_model=ProductListResponse)
def list_products(
    db: Session = Depends(get_db_dep),
    page: int = 1,
    limit: int = 20,
    q: Optional[str] = None,
    category_id: Optional[str] = None,
    is_featured: Optional[bool] = None,
    in_stock: Optional[bool] = None,
    sort: Optional[str] = None,
):
    if page < 1:
        page = 1
    cache_key = f"list:{page}:{limit}:{q}:{category_id}:{is_featured}:{in_stock}:{sort}"
    cached = products_cache.get(cache_key)
    if cached:
        return cached
    qset = db.query(Product).filter(Product.is_active == True, Product.status == ProductStatus.active)
    if q:
        like = f"%{q.lower()}%"
        qset = qset.filter(Product.name.ilike(like) | Product.short_description.ilike(like) | Product.detailed_description.ilike(like))
    if category_id:
        # include products with primary category or via junction
        qset = qset.filter((Product.category_id == category_id) | (Product.id.in_(db.query(ProductCategory.product_id).filter(ProductCategory.category_id == category_id))))
    if is_featured is not None:
        qset = qset.filter(Product.is_featured == is_featured)
    if in_stock is not None:
        if in_stock:
            qset = qset.filter(Product.inventory_quantity > 0)
        else:
            qset = qset.filter(Product.inventory_quantity <= 0)
    total = qset.count()
    if sort == "price_asc":
        qset = qset.order_by(Product.base_price.asc())
    elif sort == "price_desc":
        qset = qset.order_by(Product.base_price.desc())
    else:
        qset = qset.order_by(Product.created_at.desc())
    items = qset.offset((page - 1) * limit).limit(limit).all()
    result = {"items": items, "total": total, "page": page, "limit": limit}
    products_cache.set(cache_key, result)
    return result

@router.get("/search", response_model=ProductSearchResponse)
def search_products(db: Session = Depends(get_db_dep), q: str = Query(...)):
    key = f"search:{q}"
    cached = search_cache.get(key)
    if cached:
        return cached
    like = f"%{q.lower()}%"
    items = db.query(Product).filter(
        Product.is_active == True,
        Product.status == ProductStatus.active,
        (Product.name.ilike(like) | Product.short_description.ilike(like) | Product.detailed_description.ilike(like))
    ).order_by(Product.created_at.desc()).limit(50).all()
    # naive suggestions: top tags containing the token
    token = q.lower().strip()
    suggestions = []
    if token:
        tag_hits = db.query(Product.tags).filter(Product.tags.isnot(None)).limit(200).all()
        pool = []
        for (tags,) in tag_hits:
            if isinstance(tags, list):
                pool.extend(tags)
        suggestions = list({t for t in pool if token in str(t).lower()})[:8]
    result = {"items": items, "total": len(items), "suggestions": suggestions}
    search_cache.set(key, result)
    return result

@router.get("/filter-options")
def filter_options(db: Session = Depends(get_db_dep)):
    cached = filters_cache.get("options")
    if cached:
        return cached
    brands = [b[0] for b in db.query(Product.brand).filter(Product.brand.isnot(None)).distinct().all()]
    tags_rows = db.query(Product.tags).filter(Product.tags.isnot(None)).all()
    tags = set()
    for (arr,) in tags_rows:
        if isinstance(arr, list):
            tags.update(arr)
    result = {
        "brands": sorted([b for b in brands if b]),
        "tags": sorted(list(tags)),
        "price_ranges": [
            {"label": "Under 499", "min": 0, "max": 499},
            {"label": "500 - 999", "min": 500, "max": 999},
            {"label": "1000 - 1999", "min": 1000, "max": 1999},
            {"label": "2000+", "min": 2000, "max": None},
        ],
    }
    filters_cache.set("options", result)
    return result

@router.get("/featured", response_model=List[ProductResponse])
def featured_products(db: Session = Depends(get_db_dep), category_id: Optional[str] = None):
    qset = db.query(Product).filter(Product.is_active == True, Product.status == ProductStatus.active, Product.is_featured == True)
    if category_id:
        qset = qset.filter((Product.category_id == category_id) | (Product.id.in_(db.query(ProductCategory.product_id).filter(ProductCategory.category_id == category_id))))
    return qset.order_by(Product.created_at.desc()).limit(12).all()

@router.get("/{slug}", response_model=ProductResponse)
def product_by_slug(slug: str, db: Session = Depends(get_db_dep)):
    p = db.query(Product).filter(Product.slug == slug, Product.is_active == True).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    return p

@router.get("/{product_id}/variants", response_model=List[ProductVariantResponse])
def product_variants(product_id: str, db: Session = Depends(get_db_dep)):
    return db.query(ProductVariant).filter(ProductVariant.product_id == product_id, ProductVariant.is_active == True).order_by(ProductVariant.sort_order).all()

@router.get("/{product_id}/related", response_model=List[ProductResponse])
def related_products(product_id: str, db: Session = Depends(get_db_dep)):
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    qset = db.query(Product).filter(Product.id != p.id, Product.is_active == True, Product.status == ProductStatus.active)
    # by categories via junction or primary
    if p.category_id:
        qset = qset.filter((Product.category_id == p.category_id) | (Product.id.in_(db.query(ProductCategory.product_id).filter(ProductCategory.category_id == p.category_id))))
    return qset.order_by(Product.total_sales.desc(), Product.created_at.desc()).limit(8).all()

# Admin endpoints
admin_router = APIRouter(prefix="/admin/products", tags=["admin-products"])

@admin_router.get("", response_model=ProductListResponse, dependencies=[Depends(require_admin_role)])
def admin_list_products(db: Session = Depends(get_db_dep), page: int = 1, limit: int = 20, q: Optional[str] = None):
    qset = db.query(Product)
    if q:
        like = f"%{q.lower()}%"
        qset = qset.filter(Product.name.ilike(like))
    total = qset.count()
    items = qset.order_by(Product.created_at.desc()).offset((page - 1)*limit).limit(limit).all()
    return {"items": items, "total": total, "page": page, "limit": limit}

@admin_router.post("", response_model=ProductResponse, dependencies=[Depends(require_admin_role)])
def create_product(payload: ProductCreate, db: Session = Depends(get_db_dep)):
    # Validation: non-negative inventory
    if payload.inventory_quantity is not None and payload.inventory_quantity < 0:
        raise HTTPException(status_code=400, detail="Inventory cannot be negative")
    p = Product(
        name=payload.name,
        slug=slugify(payload.name),
        short_description=payload.short_description,
        detailed_description=payload.detailed_description,
        category_id=payload.category_id,
        brand=payload.brand,
        base_price=payload.base_price,
        compare_price=payload.compare_price,
        ingredients=payload.ingredients,
        usage_instructions=payload.usage_instructions,
        benefits=payload.benefits,
        skin_type=payload.skin_type,
        hair_type=payload.hair_type,
        track_inventory=payload.track_inventory,
        inventory_quantity=payload.inventory_quantity,
        is_featured=payload.is_featured,
        tags=payload.tags,
        meta_title=payload.meta_title,
        meta_description=payload.meta_description,
    )
    db.add(p)
    db.commit()
    db.refresh(p)
    # product SKU uniqueness if provided
    if payload.sku:
        exists = db.query(Product).filter(Product.sku == payload.sku, Product.id != p.id).first()
        if exists:
            raise HTTPException(status_code=400, detail=f"Product SKU '{payload.sku}' already exists")
    # multi-categories support via junction
    categories = payload.categories or []
    if payload.category_id and not any(c.id == payload.category_id for c in categories):
        categories.append(type("_Tmp", (), {"id": payload.category_id, "is_primary": True}))
    # persist
    for c in categories:
        db.add(ProductCategory(product_id=p.id, category_id=c.id, is_primary=getattr(c, "is_primary", False)))
    db.commit()
    # images
    if payload.images:
        for (i, img) in enumerate(payload.images):
            im = ProductImage(product_id=p.id, image_url=img.image_url, alt_text=img.alt_text, sort_order=img.sort_order or i)
            db.add(im)
        db.commit()
    # variants
    has_active_variant = False
    if payload.variants:
        for (i, v) in enumerate(payload.variants):
            if v.inventory_quantity is not None and v.inventory_quantity < 0:
                raise HTTPException(status_code=400, detail="Variant inventory cannot be negative")
            # SKU uniqueness check
            if v.sku:
                exists = db.query(ProductVariant).filter(ProductVariant.sku == v.sku).first()
                if exists:
                    raise HTTPException(status_code=400, detail=f"Variant SKU '{v.sku}' already exists")
            var = ProductVariant(
                product_id=p.id,
                title=v.title,
                sku=v.sku,
                price=v.price,
                weight=v.weight,
                size=v.size,
                color=v.color,
                scent=v.scent,
                inventory_quantity=v.inventory_quantity,
                is_active=v.is_active,
                sort_order=i,
            )
            has_active_variant = has_active_variant or bool(v.is_active)
            db.add(var)
        db.commit()
    # business rule: at least one active variant if variants provided
    if payload.variants and not has_active_variant:
        raise HTTPException(status_code=400, detail="At least one active variant is required")
    db.refresh(p)
    return p

@admin_router.put("/{product_id}", response_model=ProductResponse, dependencies=[Depends(require_admin_role)])
def update_product(product_id: str, payload: ProductUpdate, db: Session = Depends(get_db_dep)):
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    data = payload.dict(exclude_unset=True)
    if "inventory_quantity" in data and data["inventory_quantity"] is not None and data["inventory_quantity"] < 0:
        raise HTTPException(status_code=400, detail="Inventory cannot be negative")
    for k, v in data.items():
        setattr(p, k, v)
    if "name" in data:
        p.slug = slugify(p.name)
    db.add(p)
    db.commit()
    db.refresh(p)
    return p

@admin_router.delete("/{product_id}", dependencies=[Depends(require_admin_role)])
def delete_product(product_id: str, db: Session = Depends(get_db_dep)):
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    # soft delete
    p.is_active = False
    db.add(p)
    db.commit()
    return {"message": "Product deleted", "success": True}

@admin_router.put("/{product_id}/status", dependencies=[Depends(require_admin_role)])
def update_status(product_id: str, payload: ProductStatusUpdate, db: Session = Depends(get_db_dep)):
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    p.is_active = payload.is_active
    p.status = payload.status
    db.add(p)
    db.commit()
    return {"message": "Status updated", "success": True}

@admin_router.put("/{product_id}/inventory", dependencies=[Depends(require_admin_role)])
def update_inventory(product_id: str, payload: ProductInventoryUpdate, db: Session = Depends(get_db_dep)):
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    if payload.inventory_quantity is not None and payload.inventory_quantity < 0:
        raise HTTPException(status_code=400, detail="Inventory cannot be negative")
    p.inventory_quantity = payload.inventory_quantity
    if payload.low_stock_threshold is not None:
        p.low_stock_threshold = payload.low_stock_threshold
    db.add(p)
    db.commit()
    return {"message": "Inventory updated", "success": True}

@admin_router.post("/{product_id}/images", response_model=ProductImageResponse, dependencies=[Depends(require_admin_role)])
def add_image(product_id: str, payload: ProductImageCreate, db: Session = Depends(get_db_dep)):
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    img = ProductImage(product_id=product_id, image_url=payload.image_url, alt_text=payload.alt_text, sort_order=payload.sort_order or 0)
    db.add(img)
    db.commit()
    db.refresh(img)
    return img

@admin_router.put("/images/{image_id}", response_model=ProductImageResponse, dependencies=[Depends(require_admin_role)])
def update_image(image_id: str, payload: ProductImageUpdate, db: Session = Depends(get_db_dep)):
    img = db.query(ProductImage).filter(ProductImage.id == image_id).first()
    if not img:
        raise HTTPException(status_code=404, detail="Image not found")
    data = payload.dict(exclude_unset=True)
    for k, v in data.items():
        setattr(img, k, v)
    db.add(img)
    db.commit()
    db.refresh(img)
    return img

@admin_router.delete("/images/{image_id}", dependencies=[Depends(require_admin_role)])
def delete_image(image_id: str, db: Session = Depends(get_db_dep)):
    img = db.query(ProductImage).filter(ProductImage.id == image_id).first()
    if not img:
        raise HTTPException(status_code=404, detail="Image not found")
    db.delete(img)
    db.commit()
    return {"message": "Image deleted", "success": True}

@admin_router.post("/images/reorder", dependencies=[Depends(require_admin_role)])
def reorder_images(order: List[dict], db: Session = Depends(get_db_dep)):
    ids = [o.get("id") for o in order]
    imgs = db.query(ProductImage).filter(ProductImage.id.in_(ids)).all()
    for im in imgs:
        match = next((o for o in order if o.get("id") == im.id), None)
        if match and isinstance(match.get("sort_order"), int):
            im.sort_order = match["sort_order"]
            db.add(im)
    db.commit()
    return {"message": "Reordered", "success": True}

@admin_router.post("/{product_id}/variants", response_model=ProductVariantResponse, dependencies=[Depends(require_admin_role)])
def add_variant(product_id: str, payload: ProductVariantCreate, db: Session = Depends(get_db_dep)):
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    if payload.inventory_quantity is not None and payload.inventory_quantity < 0:
        raise HTTPException(status_code=400, detail="Variant inventory cannot be negative")
    if payload.sku:
        exists = db.query(ProductVariant).filter(ProductVariant.sku == payload.sku).first()
        if exists:
            raise HTTPException(status_code=400, detail=f"Variant SKU '{payload.sku}' already exists")
    v = ProductVariant(product_id=product_id, title=payload.title, sku=payload.sku, price=payload.price, weight=payload.weight, size=payload.size, color=payload.color, scent=payload.scent, inventory_quantity=payload.inventory_quantity, is_active=payload.is_active)
    db.add(v)
    db.commit()
    db.refresh(v)
    return v

@admin_router.put("/variants/{variant_id}", response_model=ProductVariantResponse, dependencies=[Depends(require_admin_role)])
def update_variant(variant_id: str, payload: ProductVariantUpdate, db: Session = Depends(get_db_dep)):
    v = db.query(ProductVariant).filter(ProductVariant.id == variant_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Variant not found")
    data = payload.dict(exclude_unset=True)
    if "inventory_quantity" in data and data["inventory_quantity"] is not None and data["inventory_quantity"] < 0:
        raise HTTPException(status_code=400, detail="Variant inventory cannot be negative")
    for k, val in data.items():
        setattr(v, k, val)
    db.add(v)
    db.commit()
    db.refresh(v)
    return v

@admin_router.delete("/variants/{variant_id}", dependencies=[Depends(require_admin_role)])
def delete_variant(variant_id: str, db: Session = Depends(get_db_dep)):
    v = db.query(ProductVariant).filter(ProductVariant.id == variant_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Variant not found")
    siblings_active = db.query(ProductVariant).filter(ProductVariant.product_id == v.product_id, ProductVariant.id != v.id, ProductVariant.is_active == True).count()
    if v.is_active and siblings_active == 0:
        raise HTTPException(status_code=400, detail="At least one active variant is required")
    db.delete(v)
    db.commit()
    return {"message": "Variant deleted", "success": True}

