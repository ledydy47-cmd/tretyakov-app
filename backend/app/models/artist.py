from sqlalchemy import Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base

class Artist(Base):
    __tablename__ = "artists"

    id:         Mapped[int] = mapped_column(Integer, primary_key=True)
    name_ru:    Mapped[str] = mapped_column(String(200), nullable=False)
    name_en:    Mapped[str] = mapped_column(String(200), nullable=True)
    birth_year: Mapped[int] = mapped_column(Integer, nullable=True)
    death_year: Mapped[int] = mapped_column(Integer, nullable=True)
    bio_short:  Mapped[str] = mapped_column(Text, nullable=True)
    bio_full:   Mapped[str] = mapped_column(Text, nullable=True)
    movement:   Mapped[str] = mapped_column(String(100), nullable=True)
    avatar_url: Mapped[str] = mapped_column(String(500), nullable=True)

    paintings: Mapped[list["Painting"]] = relationship(
        back_populates="artist", lazy="selectin"
    )
