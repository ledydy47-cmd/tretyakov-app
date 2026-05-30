import WebApp from '@twa-dev/sdk'

export const tg = WebApp

// Проверка: запущено ли приложение в Telegram
export const isTelegram = (): boolean => {
  return WebApp.initDataUnsafe !== undefined
}

// Получение данных пользователя из Telegram (может быть undefined)
export const getUser = () => {
  return WebApp.initDataUnsafe?.user
}

// Показываем главную кнопку (внизу экрана)
export const showMainButton = (text: string, callback: () => void) => {
  WebApp.MainButton.setText(text)
  WebApp.MainButton.onClick(callback)
  WebApp.MainButton.show()
}

// Скрываем главную кнопку (исправлено: убран несуществующий offClick)
export const hideMainButton = () => {
  WebApp.MainButton.hide()
  // WebApp.MainButton.offClick() — НЕ СУЩЕСТВУЕТ, удалено
}

// Всплывающее уведомление
export const showAlert = (message: string) => {
  WebApp.showAlert(message)
}

// Подтверждение действия
export const showConfirm = (message: string, callback: (confirmed: boolean) => void) => {
  WebApp.showConfirm(message, callback)
}

// Закрытие приложения
export const closeApp = () => {
  WebApp.close()
}

// Отправка данных боту
export const sendData = (data: string) => {
  WebApp.sendData(data)
}

// Вибрация (Haptic Feedback)
export const hapticFeedback = {
  impact: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light') => {
    WebApp.HapticFeedback.impactOccurred(style)
  },
  success: () => {
    WebApp.HapticFeedback.notificationOccurred('success')
  },
  error: () => {
    WebApp.HapticFeedback.notificationOccurred('error')
  },
  warning: () => {
    WebApp.HapticFeedback.notificationOccurred('warning')
  }
}