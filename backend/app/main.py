from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from app.db.database import engine, Base
import app.models
from app.routers import paintings, artists, quiz


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Сервер запускается...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        print("✅ Таблицы созданы!")
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

# Отдаём картины как статические файлы
app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(paintings.router)
app.include_router(artists.router)
app.include_router(quiz.router)


@app.get("/health")
async def health():
    return {"status": "ok", "message": "Сервер работает!"}
