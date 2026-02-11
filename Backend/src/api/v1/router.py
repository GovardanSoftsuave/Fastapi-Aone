from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from services.auth_service import create_user, authenticate_user, get_user_by_id
from auth.security import encode_token
from auth.dependencies import get_current_user
from core.limiter import limiter
from core.cache import cache

router = APIRouter()

# HEALTH (PUBLIC) 
@router.get("/health", dependencies=[])
async def health():
    return {"status": "ok"}


# SIGNUP (PUBLIC) 
@router.post("/signup", dependencies=[])
@limiter.limit("5/minute")
async def signup(
    request: Request,
    email: str,
    name: str,
    password: str,
    db: AsyncSession = Depends(get_db),
):
    user = await create_user(
        db=db,
        email=email,
        full_name=name,
        password=password,
    )

    return {
        "message": "User created successfully",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.full_name,
            "role": user.role,
        },
    }


# LOGIN (PUBLIC) 
@router.post("/login", dependencies=[])
@limiter.limit("5/minute")
async def login(
    request: Request,
    email: str,
    password: str,
    db: AsyncSession = Depends(get_db),
):
    user = await authenticate_user(db, email, password)

    if not user:
        raise Exception("Invalid credentials")

    token = encode_token(user.id)

    return {
        "access_token": token,
        "token_type": "bearer",
        "username": user.full_name,
        "role": user.role,
        "id": user.id
    }

# ADMIN LOGIN (PUBLIC)
@router.post("/admin/login", dependencies=[])
@limiter.limit("5/minute")
async def admin_login(
    request: Request,
    email: str,
    password: str,
    db: AsyncSession = Depends(get_db),
):
    user = await authenticate_user(db, email, password)

    if not user:
        raise Exception("Invalid credentials")

    if user.role != "admin":
        raise Exception("Access denied: Admins only")

    token = encode_token(user.id)

    return {
        "access_token": token,
        "token_type": "bearer",
        "username": user.full_name,
        "role": user.role,
        "id": user.id
    }

# ME (PROTECTED) 
@router.get("/me", dependencies=[])
async def get_me(
    current_user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Try to get from cache
    cache_key = f"user:{current_user_id}"
    cached_data = await cache.get(cache_key)
    
    if cached_data:
        # We store simple comma-separated string for demo: "email,name,role"
        # Or better, just JSON. For now, let's assume we store "email|name|role"
        try:
            email, name, role = cached_data.split("|")
            return {
                "id": int(current_user_id),
                "email": email,
                "name": name,
                "role": role,
            }
        except ValueError:
            pass # Cache invalid, fallback to DB

    user = await get_user_by_id(db, int(current_user_id))
    if not user:
        raise Exception("User not found")
    
    # Set cache
    await cache.set(cache_key, f"{user.email}|{user.full_name}|{user.role}", expire=60)
    
    return {
        "id": user.id,
        "email": user.email,
        "name": user.full_name,
        "role": user.role,
    }
