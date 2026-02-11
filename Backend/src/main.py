from fastapi import FastAPI
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from core.middleware import add_common_middleware
from core.config import settings
from core.exceptions import register_exception_handlers
from core.limiter import limiter
from api.v1.router import router as api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

add_common_middleware(app)
register_exception_handlers(app)

app.include_router(
    api_router,
    prefix=settings.API_V1_PREFIX,
    dependencies=[],
)


# chmod +x manage.sh
# uvicorn main:app --reload --port 8800
# python manage.py ping
# python manage.py create-admin
