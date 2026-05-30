import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import WebApp from '@twa-dev/sdk'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: { 
    queries: { retry: 1, staleTime: 5 * 60 * 1000 } 
  }
})

// Компонент для инициализации Telegram
function TelegramInit() {
  useEffect(() => {
    // Проверяем, что приложение запущено в Telegram
    if (WebApp.initDataUnsafe?.user) {
      WebApp.ready()
      WebApp.expand()
      
      // Применяем тему Telegram к нашим переменным
      const tg = WebApp.themeParams
      document.documentElement.style.setProperty('--tg-theme-bg-color', tg.bg_color || '#F5F0E8')
      document.documentElement.style.setProperty('--tg-theme-text-color', tg.text_color || '#1A1A1A')
      document.documentElement.style.setProperty('--tg-theme-button-color', tg.button_color || '#6B1E2A')
      document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.button_text_color || '#FFFFFF')
      
      console.log('✅ Telegram Web App:', WebApp.initDataUnsafe.user)
    }
  }, [])
  return null
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TelegramInit />
        <div className="app-container">
          <App />
        </div>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
)