from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from services.auth_service import create_user, authenticate_user
from auth.security import encode_token

router = APIRouter()

# ---------------- HEALTH (PUBLIC) ----------------
@router.get("/health", dependencies=[])
async def health():
    return {"status": "ok"}


# ---------------- SIGNUP (PUBLIC) ----------------
@router.post("/signup", dependencies=[])
async def signup(
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
        },
    }


# ---------------- LOGIN (PUBLIC) ----------------
@router.post("/login", dependencies=[])
async def login(
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
    }
