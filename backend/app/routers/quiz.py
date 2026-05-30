from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from app.db.database import get_db
from app.models.painting import Painting
import random

router = APIRouter(prefix="/api/quiz", tags=["quiz"])


@router.get("/question")
async def get_quiz_question(
    db: AsyncSession = Depends(get_db),
):
    result = await db.scalars(
        select(Painting)
        .options(selectinload(Painting.artist))
        .where(Painting.is_published == True)
    )
    all_paintings = list(result.all())

    if len(all_paintings) < 4:
        raise HTTPException(status_code=400, detail="Недостаточно картин для теста")

    correct = random.choice(all_paintings)
    q_type = random.choice(["author", "title", "year"])

    if q_type == "author":
        question = f"Кто написал картину «{correct.title_ru}»?"
        correct_answer = correct.artist.name_ru
        wrong_answers = list({
            p.artist.name_ru
            for p in all_paintings
            if p.artist.name_ru != correct_answer
        })
        wrong_answers = random.sample(wrong_answers, min(3, len(wrong_answers)))

    elif q_type == "title":
        question = "Как называется эта картина?"
        correct_answer = correct.title_ru
        wrong_answers = random.sample(
            [p.title_ru for p in all_paintings if p.title_ru != correct_answer],
            min(3, len(all_paintings) - 1)
        )

    else:
        question = f"В каком году написана картина «{correct.title_ru}»?"
        correct_answer = f"{correct.year_created} г."
        wrong_answers = list({
            f"{p.year_created} г."
            for p in all_paintings
            if p.year_created != correct.year_created
        })
        wrong_answers = random.sample(wrong_answers, min(3, len(wrong_answers)))

    while len(wrong_answers) < 3:
        wrong_answers.append("Неизвестно")

    all_answers = [correct_answer] + wrong_answers
    random.shuffle(all_answers)

    return {
        "painting_id": correct.id,
        "image_url": correct.image_url,
        "question": question,
        "question_type": q_type,
        "correct_answer": correct_answer,
        "answers": all_answers,
    }
