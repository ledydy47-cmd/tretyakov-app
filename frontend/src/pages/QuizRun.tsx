import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:8000' })

const getQuestion = async () => {
  const res = await api.get('/api/quiz/question')
  return res.data
}

export default function QuizRunPage() {
  const [questionKey, setQuestionKey] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const { data: question, isLoading } = useQuery({
    queryKey: ['quiz-question', questionKey],
    queryFn: getQuestion,
    staleTime: 0,
  })

  const handleAnswer = (answer: string) => {
    if (selected) return
    setSelected(answer)
    setTotal(t => t + 1)
    if (answer === question.correct_answer) {
      setScore(s => s + 1)
    }
  }

  const handleNext = () => {
    setSelected(null)
    setQuestionKey(k => k + 1)
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
    const emoji = percent >= 80 ? '🏆' : percent >= 50 ? '👍' : '📚'
    return (
      <div style={{ padding: '24px 16px', textAlign: 'center' }}>
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '32px 24px',
          boxShadow: 'var(--shadow-card)',
          marginTop: '40px',
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>{emoji}</div>
          <h1 style={{ fontSize: '28px', color: 'var(--color-primary)', marginBottom: '8px' }}>
            {percent}%
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
            Правильных ответов: {score} из {total}
          </p>
          <div style={{
            background: 'var(--color-bg)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
          }}>
            {percent >= 80 && <p style={{ color: 'var(--color-primary)' }}>Отличный результат! Ты хорошо знаешь шедевры Третьяковки 🎨</p>}
            {percent >= 50 && percent < 80 && <p style={{ color: 'var(--color-primary)' }}>Неплохо! Продолжай изучать картины 📖</p>}
            {percent < 50 && <p style={{ color: 'var(--color-primary)' }}>Стоит ещё поизучать картины перед тестом 💪</p>}
          </div>
          <button className="btn-primary" onClick={handleRestart}>
            🔄 Пройти ещё раз
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px 16px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
      }}>
        <h1 style={{ fontSize: '20px', color: 'var(--color-primary)' }}>
          ✏️ Тест
        </h1>
        <div style={{
          background: 'var(--color-primary)',
          color: 'white',
          borderRadius: '20px',
          padding: '4px 16px',
          fontSize: '14px',
        }}>
          {score}/{total}
        </div>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="skeleton" style={{ height: '240px', borderRadius: '16px' }} />
          <div className="skeleton" style={{ height: '24px', borderRadius: '8px' }} />
          <div className="skeleton" style={{ height: '56px', borderRadius: '12px' }} />
          <div className="skeleton" style={{ height: '56px', borderRadius: '12px' }} />
          <div className="skeleton" style={{ height: '56px', borderRadius: '12px' }} />
          <div className="skeleton" style={{ height: '56px', borderRadius: '12px' }} />
        </div>
      ) : question ? (
        <motion.div
          key={questionKey}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Картина */}
{(
  <div style={{
    border: '6px solid var(--color-gold)',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '16px',
  }}>
    <img
      src={question.image_url}
      alt="Угадай картину"
      style={{ width: '100%', height: '240px', objectFit: 'cover', display: 'block' }}
    />
  </div>
)}


          {/* Вопрос */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '16px',
            boxShadow: 'var(--shadow-card)',
          }}>
            <p style={{
              fontSize: '16px',
              color: 'var(--color-text)',
              lineHeight: '1.5',
              fontWeight: 'bold',
            }}>
              {question.question}
            </p>
          </div>

          {/* Варианты ответов */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {question.answers.map((answer: string, i: number) => {
              let bg = 'white'
              let border = '2px solid var(--color-border)'
              let color = 'var(--color-text)'

              if (selected) {
                if (answer === question.correct_answer) {
                  bg = '#e8f5e9'
                  border = '2px solid #4caf50'
                  color = '#2e7d32'
                } else if (answer === selected) {
                  bg = '#ffebee'
                  border = '2px solid #f44336'
                  color = '#c62828'
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(answer)}
                  style={{
                    background: bg,
                    border: border,
                    borderRadius: '12px',
                    padding: '14px 16px',
                    fontSize: '15px',
                    color: color,
                    textAlign: 'left',
                    cursor: selected ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: 'inherit',
                  }}
                >
                  {answer}
                </button>
              )
            })}
          </div>

          {/* Кнопки после ответа */}
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', gap: '12px' }}
            >
              <button className="btn-outline" onClick={handleRestart} style={{ fontSize: '14px' }}>
                Завершить
              </button>
              <button className="btn-primary" onClick={handleNext}>
                Следующий →
              </button>
            </motion.div>
          )}
        </motion.div>
      ) : null}
    </div>
  )
}
