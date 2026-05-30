from pydantic_settings import BaseSettings
from pathlib import Path

# Путь к .env файлу — ищем его в корне проекта
ENV_PATH = Path(__file__).parent.parent.parent / ".env"

class Settings(BaseSettings):
    DATABASE_URL: str
    BOT_TOKEN: str
    SECRET_KEY: str
    CLOUDFLARE_R2_URL: str
    CLOUDFLARE_R2_KEY: str
    CLOUDFLARE_R2_SECRET: str
    CLOUDFLARE_R2_BUCKET: str = "tretyakov-paintings"

    class Config:
        env_file = str(ENV_PATH)

settings = Settings()
