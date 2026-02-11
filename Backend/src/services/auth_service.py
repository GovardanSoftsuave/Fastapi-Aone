from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.user import User
from auth.password import verify_password, hash_password

async def create_user(db: AsyncSession, email: str, full_name: str, password: str, role: str = "user") -> User:
    user = User(
        email=email,
        hashed_password=hash_password(password),
        full_name=full_name,
        role=role
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def authenticate_user(db: AsyncSession, email: str, password: str) -> User | None:
    result = await db.execute(select(User).where(User.email == email))
    print(result)
    user = result.scalar_one_or_none()
    print(user)
    if user and verify_password(password, user.hashed_password):
        return user
    return None

async def get_user_by_id(db: AsyncSession, user_id: int) -> User | None:
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    return user