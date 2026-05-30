import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom' // <--- Добавили
import { motion } from 'framer-motion'
import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:8000' })

// Функция теперь принимает тип
const getQuestion = async (type: string) => {
  const res = await api.get('/api/quiz/question', { params: { quiz_type: type } })
  return res.data
}

const QUIZ_KEY = 'tretyakov_quiz_progress'

export default function QuizRunPage() {
  const [searchParams] = useSearchParams()
  // Считываем параметры из URL: /quiz/run?type=author&count=5
  const quizType = searchParams.get('type') || 'random'
  const totalCount = parseInt(searchParams.get('count') || '5', 10)

  const [questionKey, setQuestionKey] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const { data: question, isLoading } = useQuery({
    // Включаем тип в ключ, чтобы кэш обновлялся при смене категории
    queryKey: ['quiz-question', questionKey, quizType],
    queryFn: () => getQuestion(quizType), // <--- Передаем тип
    staleTime: 0,
  })

  const handleAnswer = (answer: string) => {
    if (selected) return
    setSelected(answer)
    if (answer === question?.correct_answer) setScore(s => s + 1)
    setTotal(t => t + 1)
  }

  const handleNext = () => {
    setSelected(null)
    if (total + 1 >= totalCount) {
      finishQuiz()
    } else {
      setQuestionKey(k => k + 1)
    }
  }

  const finishQuiz = () => {
    const saved = JSON.parse(localStorage.getItem(QUIZ_KEY) || '{"totalTests":0,"totalQuestions":0,"correctAnswers":0}')
    saved.totalTests += 1
    saved.totalQuestions += total
    saved.correctAnswers += score
    localStorage.setItem(QUIZ_KEY, JSON.stringify(saved))
    setShowResult(true)
  }

  const handleRestart = () => {
    setSelected(null)
    setScore(0)
    setTotal(0)
    setShowResult(false)
    setQuestionKey(k => k + 1)
  }

  if (showResult) {
    const percent = total > 0 ? Math.round((score / total) * 100) : 0
    return (
      <div style={{ padding: '24px 16px', textAlign: 'center' }}>
        <div style={{ background: 'white', borderRadius: '24px', padding: '32px 24px', boxShadow: 'var(--shadow-card)', marginTop: '20px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>{percent >= 80 ? '🏆' : percent >= 50 ? '👍' : '📚'}</div>
          <h1 style={{ fontSize: '36px', color: 'var(--color-primary)', marginBottom: '8px' }}>{percent}%</h1>
          <p style={{ fontSize: '16px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>Правильных: {score} из {total}</p>
          <button className="btn-primary" onClick={handleRestart}>🔄 Пройти ещё раз</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px 16px' }}>
      {/* Прогресс-бар */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '20px', color: 'var(--color-primary)' }}>✏️ Тест ({quizType})</h1>
          <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>{total}/{totalCount}</span>
        </div>
        <div style={{ background: 'var(--color-bg)', borderRadius: '8px', height: '6px', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(total / totalCount) * 100}%` }}
            transition={{ duration: 0.4 }}
            style={{ height: '100%', background: 'var(--color-primary)', borderRadius: '8px' }}
          />
        </div>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="skeleton" style={{ height: '240px', borderRadius: '16px' }} />
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '56px', borderRadius: '12px' }} />)}
        </div>
      ) : question ? (
        <motion.div key={questionKey} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          {/* Картинка */}
          <div style={{ border: '6px solid var(--color-gold)', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
            <img src={question.image_url} alt="Картина" style={{ width: '100%', height: '240px', objectFit: 'cover', display: 'block' }} />
          </div>

          {/* Вопрос */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '16px', marginBottom: '16px', boxShadow: 'var(--shadow-card)' }}>
            <p style={{ fontSize: '16px', color: 'var(--color-text)', lineHeight: '1.5', fontWeight: 'bold' }}>{question.question}</p>
          </div>

          {/* Варианты */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {question.answers.map((answer: string, i: number) => {
              let bg = 'white', border = '2px solid var(--color-border)', color = 'var(--color-text)'
              if (selected) {
                if (answer === question.correct_answer) { bg = '#e8f5e9'; border = '2px solid #4caf50'; color = '#2e7d32' }
                else if (answer === selected) { bg = '#ffebee'; border = '2px solid #f44336'; color = '#c62828' }
              }
              return (
                <button key={i} onClick={() => handleAnswer(answer)} disabled={!!selected}
                  style={{ background: bg, border, borderRadius: '12px', padding: '14px 16px', fontSize: '15px', color, textAlign: 'left', cursor: selected ? 'default' : 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' }}>
                  {answer}
                </button>
              )
            })}
          </div>

          {selected && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-outline" onClick={finishQuiz} style={{ fontSize: '14px' }}>Завершить</button>
              <button className="btn-primary" onClick={handleNext}>Следующий →</button>
            </motion.div>
          )}
        </motion.div>
      ) : null}
    </div>
  )
}