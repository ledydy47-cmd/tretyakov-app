import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // <-- ОН ЗДЕСЬ
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import WebApp from '@twa-dev/sdk'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 5 * 60 * 1000 } }
})

function TelegramInit() {
  useEffect(() => {
    if (WebApp.initDataUnsafe?.user) {
      WebApp.ready()
      WebApp.expand()
    }
  }, [])
  return null
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* BrowserRouter ТОЛЬКО здесь */}
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