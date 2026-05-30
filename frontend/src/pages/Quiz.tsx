import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const QUIZ_KEY = 'tretyakov_quiz_progress'
const STUDIED_KEY = 'tretyakov_studied_ids'

export default function QuizPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ totalTests: 0, totalQuestions: 0, correctAnswers: 0, studied: 0 })
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedType, setSelectedType] = useState('random')

  const loadStats = () => {
    const q = JSON.parse(localStorage.getItem(QUIZ_KEY) || '{"totalTests":0,"totalQuestions":0,"correctAnswers":0}')
    const s = JSON.parse(localStorage.getItem(STUDIED_KEY) || '[]')
    setStats({ ...q, studied: s.length })
  }
  useEffect(() => { loadStats() }, [])

  const accuracy = stats.totalQuestions > 0 ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) : 0

  const startQuiz = (type: string, count: number) => {
    setModalOpen(false)
    navigate(`/quiz/run?type=${type}&count=${count}`)
  }

  const quizTypes = [
    { id: 'author', icon: '🎨', title: 'Угадай художника', desc: 'Кто написал эту картину?', color: '#6B1E2A' },
    { id: 'title', icon: '🖼️', title: 'Угадай картину', desc: 'По фрагменту определи название', color: '#8B2635' },
    { id: 'year', icon: '📅', title: 'Угадай год', desc: 'В каком году создана работа?', color: '#C9A84C' },
    { id: 'random', icon: '🏛️', title: 'Случайный микс', desc: 'Вопросы на все темы', color: '#4A6741' },
  ]

  return (
    <div style={{ padding: '24px 16px' }}>
      <h1 style={{ fontSize: '24px', color: 'var(--color-primary)', textAlign: 'center', marginBottom: '8px' }}>✏️ Тесты</h1>
      <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '24px' }}>Выбери тему и количество вопросов</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {quizTypes.map(q => (
          <div key={q.id} onClick={() => { setSelectedType(q.id); setModalOpen(true) }} style={{ background: 'white', borderRadius: '16px', padding: '16px', boxShadow: 'var(--shadow-card)', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', border: '1px solid var(--color-border)' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: q.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>{q.icon}</div>
            <div><p style={{ fontWeight: 'bold', fontSize: '16px', color: 'var(--color-text)', marginBottom: '4px' }}>{q.title}</p><p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{q.desc}</p></div>
            <span style={{ marginLeft: 'auto', color: 'var(--color-text-muted)' }}>→</span>
          </div>
        ))}
      </div>

      {/* Статистика */}
      <div style={{ marginTop: '24px', background: 'white', borderRadius: '16px', padding: '20px', boxShadow: 'var(--shadow-card)' }}>
        <p style={{ fontWeight: 'bold', fontSize: '16px', color: 'var(--color-primary)', marginBottom: '16px' }}>📊 Твой прогресс</p>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '16px' }}>
          <CircleProgress value={accuracy} label="Точность" color="var(--color-primary)" />
          <CircleProgress value={stats.totalTests} label="Тестов" color="var(--color-gold)" />
          <CircleProgress value={Math.min(stats.studied * 5, 100)} label="Изучено" color="#4A6741" />
        </div>
        <ProgressBar label="Правильные ответы" value={stats.correctAnswers} max={stats.totalQuestions} color="#4A6741" />
        <ProgressBar label="Осталось изучить" value={200 - stats.studied} max={200} color="var(--color-text-muted)" />
      </div>

      {/* Модалка выбора количества */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '20px', padding: '24px', width: '85%', maxWidth: '320px', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '16px', color: 'var(--color-primary)' }}>Сколько вопросов?</h3>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '16px' }}>
                {[5, 10, 15].map(n => (
                  <button key={n} onClick={() => startQuiz(selectedType, n)} style={{ flex: 1, padding: '12px', background: 'var(--color-bg)', border: '2px solid var(--color-border)', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>{n}</button>
                ))}
              </div>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', textDecoration: 'underline', cursor: 'pointer' }}>Отмена</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CircleProgress({ value, label, color }: { value: number, label: string, color: string }) {
  const radius = 30, circumference = 2 * Math.PI * radius
  const percent = value > 100 ? 100 : value
  const offset = circumference - (percent / 100) * circumference
  return (
    <div style={{ textAlign: 'center' }}>
      <svg width="70" height="70" viewBox="0 0 70 70">
        <circle cx="35" cy="35" r={radius} fill="none" stroke="var(--color-bg)" strokeWidth="6" />
        <circle cx="35" cy="35" r={radius} fill="none" stroke={color} strokeWidth="6" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 35 35)" style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
        <text x="35" y="38" textAnchor="middle" fontSize="16" fontWeight="bold" fill={color}>{value}{value <= 100 ? '%' : ''}</text>
      </svg>
      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>{label}</p>
    </div>
  )
}

function ProgressBar({ label, value, max, color }: { label: string, value: number, max: number, color: string }) {
  const percent = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
        <span>{label}</span><span>{value}/{max}</span>
      </div>
      <div style={{ background: 'var(--color-bg)', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
        <div style={{ height: '100%', background: color, width: `${percent}%`, borderRadius: '8px', transition: 'width 0.5s ease' }} />
      </div>
    </div>
  )
}