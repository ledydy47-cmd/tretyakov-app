from sqlalchemy import Integer, String, Text, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from app.db.database import Base

class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id:             Mapped[int]  = mapped_column(Integer, primary_key=True)
    painting_id:    Mapped[int]  = mapped_column(ForeignKey("paintings.id"))
    question_type:  Mapped[str]  = mapped_column(String(50), nullable=False)
    question_text:  Mapped[str]  = mapped_column(Text, nullable=False)
    correct_answer: Mapped[str]  = mapped_column(Text, nullable=False)
    wrong_answer_1: Mapped[str]  = mapped_column(Text, nullable=False)
    wrong_answer_2: Mapped[str]  = mapped_column(Text, nullable=False)
    wrong_answer_3: Mapped[str]  = mapped_column(Text, nullable=False)
    fragment_url:   Mapped[str]  = mapped_column(String(500), nullable=True)
    difficulty:     Mapped[int]  = mapped_column(Integer, default=2)
    is_active:      Mapped[bool] = mapped_column(Boolean, default=True)
    created_at:     Mapped[DateTime] = mapped_column(
        DateTime, server_default=func.now()
    )


class QuizSession(Base):
    __tablename__ = "quiz_sessions"

    id:              Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id:         Mapped[int] = mapped_column(ForeignKey("users.id"))
    quiz_type:       Mapped[str] = mapped_column(String(50), nullable=True)
    total_questions: Mapped[int] = mapped_column(Integer, nullable=True)
    correct_answers: Mapped[int] = mapped_column(Integer, default=0)
    time_spent_sec:  Mapped[int] = mapped_column(Integer, nullable=True)
    started_at:      Mapped[DateTime] = mapped_column(
        DateTime, server_default=func.now()
    )
    finished_at:     Mapped[DateTime] = mapped_column(
        DateTime, nullable=True
    )


class QuizAnswer(Base):
    __tablename__ = "quiz_answers"

    id:            Mapped[int]  = mapped_column(Integer, primary_key=True)
    session_id:    Mapped[int]  = mapped_column(ForeignKey("quiz_sessions.id"))
    question_id:   Mapped[int]  = mapped_column(ForeignKey("quiz_questions.id"))
    user_id:       Mapped[int]  = mapped_column(ForeignKey("users.id"))
    user_answer:   Mapped[str]  = mapped_column(Text, nullable=False)
    is_correct:    Mapped[bool] = mapped_column(Boolean, nullable=False)
    time_spent_sec: Mapped[int] = mapped_column(Integer, nullable=True)
    answered_at:   Mapped[DateTime] = mapped_column(
        DateTime, server_default=func.now()
    )
