from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # ── App ──
    APP_NAME: str = "PlayScope API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # ── Database ──
    DATABASE_URL: str = "postgresql+asyncpg://playscope:playscope@localhost:5432/playscope"
    DATABASE_SYNC_URL: str = "postgresql://playscope:playscope@localhost:5432/playscope"

    # ── JWT ──
    JWT_SECRET_KEY: str = "CHANGE-ME-TO-A-REAL-SECRET-KEY-IN-PRODUCTION"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # ── Storage ──
    UPLOAD_DIR: str = "./storage/uploads"
    RESULTS_DIR: str = "./storage/results"

    # ── AI Engine ──
    AI_ENGINE_URL: str = "http://localhost:8001"

    # ── CORS ──
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
    ]

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()
