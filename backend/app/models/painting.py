from sqlalchemy import Integer, String, Text, Boolean, Numeric, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base

class Painting(Base):
    __tablename__ = "paintings"

    id:                Mapped[int]   = mapped_column(Integer, primary_key=True)
    artist_id:         Mapped[int]   = mapped_column(ForeignKey("artists.id"))
    title_ru:          Mapped[str]   = mapped_column(String(300), nullable=False)
    title_en:          Mapped[str]   = mapped_column(String(300), nullable=True)
    year_created:      Mapped[int]   = mapped_column(Integer, nullable=True)
    year_end:          Mapped[int]   = mapped_column(Integer, nullable=True)
    technique:         Mapped[str]   = mapped_column(String(200), nullable=True)
    width_cm:          Mapped[float] = mapped_column(Numeric(7, 2), nullable=True)
    height_cm:         Mapped[float] = mapped_column(Numeric(7, 2), nullable=True)
    description_short: Mapped[str]   = mapped_column(Text, nullable=False)
    description_full:  Mapped[str]   = mapped_column(Text, nullable=False)
    interesting_facts: Mapped[str]   = mapped_column(Text, nullable=True)
    image_url:         Mapped[str]   = mapped_column(String(500), nullable=False)
    image_url_thumb:   Mapped[str]   = mapped_column(String(500), nullable=True)
    wikimedia_source:  Mapped[str]   = mapped_column(String(500), nullable=True)
    license_type:      Mapped[str]   = mapped_column(String(50), default="PD")
    genre:             Mapped[str]   = mapped_column(String(100), nullable=True)
    period:            Mapped[str]   = mapped_column(String(100), nullable=True)
    style:             Mapped[str]   = mapped_column(String(100), nullable=True)
    difficulty:        Mapped[int]   = mapped_column(Integer, default=2)
    popularity_rank:   Mapped[int]   = mapped_column(Integer, nullable=True)
    is_published:      Mapped[bool]  = mapped_column(Boolean, default=True)

    artist: Mapped["Artist"] = relationship(back_populates="paintings")
