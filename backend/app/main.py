from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.db.database import engine, Base
import app.models  # Импортируем все модели чтобы они зарегистрировались

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Сервер запускается...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        print("✅ Таблицы созданы в базе данных!")
    yield
    print("🛑 Сервер остановлен")

app = FastAPI(
    title="200 шедевров Третьяковки API",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "ok", "message": "Сервер работает!"}
