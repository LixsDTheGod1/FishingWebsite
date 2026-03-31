import { createContext } from 'react'

type ToastContextValue = {
  showToast: (message: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
