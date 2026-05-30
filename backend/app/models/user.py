from sqlalchemy import Integer, String, Boolean, BigInteger, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id:               Mapped[int]  = mapped_column(Integer, primary_key=True)
    telegram_id:      Mapped[int]  = mapped_column(BigInteger, unique=True, nullable=False)
    username:         Mapped[str]  = mapped_column(String(100), nullable=True)
    first_name:       Mapped[str]  = mapped_column(String(100), nullable=True)
    last_name:        Mapped[str]  = mapped_column(String(100), nullable=True)
    has_access:       Mapped[bool] = mapped_column(Boolean, default=False)
    payment_id:       Mapped[str]  = mapped_column(String(200), nullable=True)
    total_studied:    Mapped[int]  = mapped_column(Integer, default=0)
    total_quizzes:    Mapped[int]  = mapped_column(Integer, default=0)
    streak_days:      Mapped[int]  = mapped_column(Integer, default=0)
    created_at:       Mapped[DateTime] = mapped_column(
        DateTime, server_default=func.now()
    )
    last_active:      Mapped[DateTime] = mapped_column(
        DateTime, nullable=True
    )


class UserProgress(Base):
    __tablename__ = "user_progress"

    id:           Mapped[int]  = mapped_column(Integer, primary_key=True)
    user_id:      Mapped[int]  = mapped_column(Integer, nullable=False)
    painting_id:  Mapped[int]  = mapped_column(Integer, nullable=False)
    is_studied:   Mapped[bool] = mapped_column(Boolean, default=False)
    study_count:  Mapped[int]  = mapped_column(Integer, default=0)
    is_favorite:  Mapped[bool] = mapped_column(Boolean, default=False)
    first_studied: Mapped[DateTime] = mapped_column(DateTime, nullable=True)
    last_studied:  Mapped[DateTime] = mapped_column(DateTime, nullable=True)
