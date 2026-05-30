import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import WebApp from '@twa-dev/sdk'
import App from './App.tsx'
import './index.css'

// Если QueryClientProvider есть в App.tsx, его можно убрать отсюда.
// Но чтобы было чисто, оставим только BrowserRouter здесь.

function TelegramInit() {
  useEffect(() => {
    if (WebApp.initDataUnsafe?.user) {
      WebApp.ready()
      WebApp.expand()
      
      const tg = WebApp.themeParams
      document.documentElement.style.setProperty('--tg-theme-bg-color', tg.bg_color || '#F5F0E8')
      document.documentElement.style.setProperty('--tg-theme-text-color', tg.text_color || '#1A1A1A')
      
      console.log('✅ Telegram Web App:', WebApp.initDataUnsafe.user)
    }
  }, [])
  return null
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* ✅ BrowserRouter ТОЛЬКО здесь */}
    <BrowserRouter>
      <TelegramInit />
      <div className="app-container">
        <App />
      </div>
    </BrowserRouter>
  </React.StrictMode>
)