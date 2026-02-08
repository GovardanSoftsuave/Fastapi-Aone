from asyncio.log import logger
from pydantic_settings import BaseSettings
from pathlib import Path
import logging
from datetime import datetime, timedelta
from logging.handlers import RotatingFileHandler

BASE_DIR = Path(__file__).resolve().parents[2]

class Settings(BaseSettings):
    PROJECT_NAME: str = "FastAPI Develop"
    PROJECT_VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    SQLALCHEMY_DATABASE_URI: str
    
    # Redis Configuration
    REDIS_URL: str

    # Encryption Configuration
    ENCRYPTION_KEY: str
    ENCRYPTION_ALGORITHM: str
    LOG_FILE: str = "app.log"
    LOG_LEVEL: str = "ERROR"
    JWT_EXPIRATION_TIME: int = 60

    class Config:
        env_file = BASE_DIR / ".env"

settings = Settings()

def setup_logging():
    logger = logging.getLogger()
    logger.setLevel(settings.LOG_LEVEL)

    handler = RotatingFileHandler(
        settings.LOG_FILE, maxBytes=10 * 1024 * 1024, backupCount=5
    )

    formatter = logging.Formatter(
        "%(asctime)s | %(levelname)s | %(name)s | %(message)s"
    )
    
    handler.setFormatter(formatter)
    
    logger.addHandler(handler)
    
    return logger

logger = setup_logging()
