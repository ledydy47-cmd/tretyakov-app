from fastapi import APIRouter, Depends, HTTPException, Query
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
    quiz_type: str = Query(None)  # author, title, year, random
):
    # 1. Получаем все картины (для выбора вариантов ответа)
    result = await db.scalars(
        select(Painting)
        .options(selectinload(Painting.artist))
        .where(Painting.is_published == True)
    )
    all_paintings = list(result.all())
    if len(all_paintings) < 4:
        raise HTTPException(status_code=400, detail="Недостаточно картин для теста")

    # 2. Выбираем правильную картину
    correct = random.choice(all_paintings)

    # 3. Определяем тип вопроса
    if quiz_type and quiz_type != "random":
        q_type = quiz_type
    else:
        q_type = random.choice(["author", "title", "year"])

    if q_type == "author":
        question = f"Кто написал картину «{correct.title_ru}»?"
        correct_answer = correct.artist.name_ru
        # Собираем уникальные имена других художников
        wrong_answers = list({p.artist.name_ru for p in all_paintings if p.artist.name_ru != correct_answer})
        wrong_answers = random.sample(wrong_answers, min(3, len(wrong_answers)))
        
    elif q_type == "title":
        question = "Как называется эта картина?"
        correct_answer = correct.title_ru
        wrong_answers = random.sample([p.title_ru for p in all_paintings if p.title_ru != correct_answer], min(3, len(all_paintings) - 1))
        
    else:  # year
        question = f"В каком году написана картина «{correct.title_ru}»?"
        correct_answer = f"{correct.year_created} г."
        # Собираем уникальные годы
        wrong_answers = list({f"{p.year_created} г." for p in all_paintings if p.year_created != correct.year_created})
        wrong_answers = random.sample(wrong_answers, min(3, len(wrong_answers)))

    # Если вариантов не хватило (мало картин в базе), дополняем
    while len(wrong_answers) < 3:
        wrong_answers.append("Неизвестно")

    # 4. Перемешиваем и возвращаем
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