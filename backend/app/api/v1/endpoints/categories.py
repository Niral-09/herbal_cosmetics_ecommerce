from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.api.deps import get_db_dep, require_admin_role
from app.models.category import Category
from app.models.product import Product
from app.models.product_category import ProductCategory
from app.schemas.category import CategoryResponse, CategoryListResponse, CategoryTreeResponse, CategoryCreate, CategoryUpdate
from app.utils.helpers import slugify

MAX_CATEGORY_DEPTH = 5

router = APIRouter(prefix="/categories", tags=["categories"])

@router.get("", response_model=List[CategoryResponse])
def list_categories(db: Session = Depends(get_db_dep), hierarchical: bool = Query(False)):
    cats = db.query(Category).filter(Category.is_active == True).order_by(Category.sort_order, Category.name).all()
    if not hierarchical:
        return cats
    id_map = {c.id: c for c in cats}
    children_map: dict[str, list[Category]] = {c.id: [] for c in cats}
    roots: list[Category] = []
    for c in cats:
        if c.parent_id and c.parent_id in id_map:
            children_map[c.parent_id].append(c)
        else:
            roots.append(c)
    def attach(c: Category) -> Category:
        c.children = children_map.get(c.id, [])  # type: ignore
        for ch in c.children:  # type: ignore
            attach(ch)
        return c
    return [attach(r) for r in roots]

@router.get("/tree", response_model=CategoryTreeResponse)
def get_tree(db: Session = Depends(get_db_dep)):
    cats = db.query(Category).filter(Category.is_active == True).order_by(Category.sort_order, Category.name).all()
    id_map = {c.id: c for c in cats}
    children_map: dict[str, list[Category]] = {c.id: [] for c in cats}
    roots: list[Category] = []
    for c in cats:
        if c.parent_id and c.parent_id in id_map:
            children_map[c.parent_id].append(c)
        else:
            roots.append(c)
    def attach(c: Category) -> Category:
        c.children = children_map.get(c.id, [])  # type: ignore
        for ch in c.children:  # type: ignore
            attach(ch)
        return c
    return {"items": [attach(r) for r in roots]}

@router.get("/{slug}", response_model=CategoryResponse)
def get_category(slug: str, db: Session = Depends(get_db_dep)):
    cat = db.query(Category).filter(Category.slug == slug, Category.is_active == True).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    return cat

@router.get("/{slug}/products")
def get_category_products(
    slug: str,
    db: Session = Depends(get_db_dep),
    page: int = 1,
    limit: int = 20,
    include_subcategories: bool = True,
):
    if page < 1:
        page = 1
    q = db.query(Product).filter(Product.is_active == True)
    cat = db.query(Category).filter(Category.slug == slug, Category.is_active == True).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    if include_subcategories:
        subq = db.query(Category.id).filter((Category.full_path == cat.full_path) | (Category.full_path.like(f"{cat.full_path}/%")))
        q = q.filter((Product.category_id.in_(subq)) | (Product.id.in_(db.query(ProductCategory.product_id).filter(ProductCategory.category_id.in_(subq)))))
    else:
        q = q.filter((Product.category_id == cat.id) | (Product.id.in_(db.query(ProductCategory.product_id).filter(ProductCategory.category_id == cat.id))))
    total = q.count()
    items = q.order_by(Product.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
    return {"items": items, "total": total, "page": page, "limit": limit}

# Admin endpoints
admin_router = APIRouter(prefix="/admin/categories", tags=["admin-categories"])

@admin_router.post("", response_model=CategoryResponse, dependencies=[Depends(require_admin_role)])
def create_category(payload: CategoryCreate, db: Session = Depends(get_db_dep)):
    cat = Category(
        name=payload.name,
        description=payload.description,
        parent_id=payload.parent_id,
        image_url=payload.image_url,
        meta_title=payload.meta_title,
        meta_description=payload.meta_description,
        is_active=payload.is_active,
        sort_order=payload.sort_order,
        slug=slugify(payload.name),
        full_path="",
    )
    parent = None
    if payload.parent_id:
        parent = db.query(Category).filter(Category.id == payload.parent_id).first()
        if not parent:
            raise HTTPException(status_code=400, detail="Parent category not found")
        if parent.level + 1 >= MAX_CATEGORY_DEPTH:
            raise HTTPException(status_code=400, detail="Max category depth exceeded")
        cat.parent = parent
    cat.set_slug_and_path()
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat

@admin_router.put("/{category_id}", response_model=CategoryResponse, dependencies=[Depends(require_admin_role)])
def update_category(category_id: str, payload: CategoryUpdate, db: Session = Depends(get_db_dep)):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    parent_changed = False
    name_changed = False
    if payload.name is not None and payload.name != cat.name:
        cat.name = payload.name
        name_changed = True
    if payload.description is not None:
        cat.description = payload.description
    if payload.parent_id is not None and payload.parent_id != cat.parent_id:
        if payload.parent_id == category_id:
            raise HTTPException(status_code=400, detail="Cannot set category as its own parent")
        parent = db.query(Category).filter(Category.id == payload.parent_id).first() if payload.parent_id else None
        if payload.parent_id and not parent:
            raise HTTPException(status_code=400, detail="Parent category not found")
        # prevent circular references: walk up the tree
        cur = parent
        while cur:
            if cur.id == category_id:
                raise HTTPException(status_code=400, detail="Circular category relationship not allowed")
            cur = cur.parent
        if parent and parent.level + 1 >= MAX_CATEGORY_DEPTH:
            raise HTTPException(status_code=400, detail="Max category depth exceeded")
        cat.parent = parent
        parent_changed = True
    if payload.image_url is not None:
        cat.image_url = payload.image_url
    if payload.meta_title is not None:
        cat.meta_title = payload.meta_title
    if payload.meta_description is not None:
        cat.meta_description = payload.meta_description
    if payload.is_active is not None:
        cat.is_active = payload.is_active
    if payload.sort_order is not None:
        cat.sort_order = payload.sort_order

    if name_changed:
        cat.slug = slugify(cat.name)
    if name_changed or parent_changed:
        cat.set_slug_and_path()
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat

@admin_router.delete("/{category_id}", dependencies=[Depends(require_admin_role)])
def delete_category(category_id: str, db: Session = Depends(get_db_dep)):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    has_children = db.query(Category).filter(Category.parent_id == category_id).first() is not None
    if has_children:
        raise HTTPException(status_code=400, detail="Cannot delete a category with child categories")
    # Soft delete via is_active; products remain but counts will reduce
    cat.is_active = False
    db.add(cat)
    db.commit()
    return {"message": "Category deleted", "success": True}

@admin_router.get("/{category_id}/products")
def admin_category_products(category_id: str, db: Session = Depends(get_db_dep)):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    items = db.query(Product).filter((Product.category_id == category_id) | (Product.id.in_(db.query(ProductCategory.product_id).filter(ProductCategory.category_id == category_id)))).order_by(Product.created_at.desc()).all()
    return {"items": items, "total": len(items)}

@admin_router.post("/reorder", dependencies=[Depends(require_admin_role)])
def reorder_categories(order: List[dict], db: Session = Depends(get_db_dep)):
    ids = [o.get("id") for o in order]
    cats = db.query(Category).filter(Category.id.in_(ids)).all()
    for c in cats:
        match = next((o for o in order if o.get("id") == c.id), None)
        if match and isinstance(match.get("sort_order"), int):
            c.sort_order = match["sort_order"]
            db.add(c)
    db.commit()
    return {"message": "Reordered", "success": True}

