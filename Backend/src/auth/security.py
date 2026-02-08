from jose import jwt
from core.config import settings

ALGORITHM = "HS256"

def decode_token(token: str) -> str:
    payload = jwt.decode(
        token,
        settings.ENCRYPTION_KEY,
        algorithms=[settings.ENCRYPTION_ALGORITHM],
    )

    user_id = payload.get("sub")
    if not user_id:
        raise Exception("Invalid token payload")

    return user_id


def encode_token(user_id: str) -> str:
    payload = {
        "sub": str(user_id),
        "exp": settings.JWT_EXPIRATION_TIME
    }

    token = jwt.encode(
        payload,
        settings.ENCRYPTION_KEY,
        algorithm=settings.ENCRYPTION_ALGORITHM,
    )

    return token