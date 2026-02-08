from fastapi import FastAPI
from core.middleware import add_common_middleware
from core.config import settings
from core.exceptions import register_exception_handlers
from api.v1.router import router as api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
)

add_common_middleware(app)
register_exception_handlers(app)

app.include_router(
    api_router,
    prefix=settings.API_V1_PREFIX,
    dependencies=[],
)


# chmod +x manage.sh
# uvicorn main:app --reload --port 8800
