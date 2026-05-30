import { Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './components/Layout/Layout'
import HomePage from './pages/Home'
import GalleryPage from './pages/Gallery'
import StudyPage from './pages/Study'
import QuizPage from './pages/Quiz'
import QuizRunPage from './pages/QuizRun'
import ProfilePage from './pages/Profile'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 5 * 60 * 1000 }
  }
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/*  Здесь НЕТ BrowserRouter! Только Routes */}
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/study" element={<StudyPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/quiz/run" element={<QuizRunPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </QueryClientProvider>
  )
}