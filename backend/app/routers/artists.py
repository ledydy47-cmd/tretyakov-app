from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.database import get_db
from app.models.artist import Artist

router = APIRouter(prefix="/api/artists", tags=["artists"])


@router.get("")
async def get_artists(db: AsyncSession = Depends(get_db)):
    result = await db.scalars(
        select(Artist).order_by(Artist.name_ru)
    )
    artists = result.all()
    return [artist_to_dict(a) for a in artists]


@router.get("/{artist_id}")
async def get_artist(
    artist_id: int,
    db: AsyncSession = Depends(get_db),
):
    artist = await db.get(Artist, artist_id)
    if not artist:
        raise HTTPException(status_code=404, detail="Художник не найден")
    return artist_to_dict(artist)


def artist_to_dict(a: Artist) -> dict:
    return {
        "id":         a.id,
        "name_ru":    a.name_ru,
        "name_en":    a.name_en,
        "birth_year": a.birth_year,
        "death_year": a.death_year,
        "movement":   a.movement,
        "bio_short":  a.bio_short,
    }
