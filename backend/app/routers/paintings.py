from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from app.db.database import get_db
from app.models.painting import Painting
from app.models.artist import Artist

router = APIRouter(prefix="/api/paintings", tags=["paintings"])


@router.get("")
async def get_paintings(
    page:      int = Query(1, ge=1),
    limit:     int = Query(20, ge=1, le=50),
    genre:     str = Query(None),
    period:    str = Query(None),
    artist_id: int = Query(None),
    db: AsyncSession = Depends(get_db),
):
    query = (
        select(Painting)
        .options(selectinload(Painting.artist))
        .where(Painting.is_published == True)
    )

    if genre:
        query = query.where(Painting.genre == genre)
    if period:
        query = query.where(Painting.period == period)
    if artist_id:
        query = query.where(Painting.artist_id == artist_id)

    total = await db.scalar(
        select(func.count()).select_from(
            select(Painting).where(Painting.is_published == True).subquery()
        )
    )
    result = await db.scalars(
        query.order_by(Painting.popularity_rank)
             .offset((page - 1) * limit)
             .limit(limit)
    )
    paintings = result.all()

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "items": [painting_to_dict(p) for p in paintings]
    }


@router.get("/random")
async def get_random_painting(
    db: AsyncSession = Depends(get_db),
):
    painting = await db.scalar(
        select(Painting)
        .options(selectinload(Painting.artist))
        .where(Painting.is_published == True)
        .order_by(func.random())
        .limit(1)
    )
    if not painting:
        raise HTTPException(status_code=404, detail="Нет картин")
    return painting_to_dict(painting)


@router.get("/{painting_id}")
async def get_painting(
    painting_id: int,
    db: AsyncSession = Depends(get_db),
):
    painting = await db.scalar(
        select(Painting)
        .options(selectinload(Painting.artist))
        .where(Painting.id == painting_id)
    )
    if not painting:
        raise HTTPException(status_code=404, detail="Картина не найдена")
    return painting_to_dict(painting)


def painting_to_dict(p: Painting) -> dict:
    return {
        "id":                p.id,
        "artist_id":         p.artist_id,
        "artist_name":       p.artist.name_ru if p.artist else "",
        "title_ru":          p.title_ru,
        "title_en":          p.title_en,
        "year_created":      p.year_created,
        "technique":         p.technique,
        "genre":             p.genre,
        "period":            p.period,
        "style":             p.style,
        "description_short": p.description_short,
        "description_full":  p.description_full,
        "interesting_facts": p.interesting_facts,
        "image_url":         p.image_url,
        "license_type":      p.license_type,
        "difficulty":        p.difficulty,
        "popularity_rank":   p.popularity_rank,
    }
