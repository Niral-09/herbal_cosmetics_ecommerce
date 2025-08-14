from fastapi import APIRouter
from .endpoints import auth, users, addresses, categories, products, cart, orders

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(addresses.router)
api_router.include_router(categories.router)
api_router.include_router(products.router)
api_router.include_router(cart.router)
api_router.include_router(orders.router)
api_router.include_router(categories.admin_router)
api_router.include_router(products.admin_router)
api_router.include_router(orders.admin_router)

@api_router.get("/ping")
async def ping():
    return {"message": "pong"}

