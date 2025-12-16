import React, { useEffect } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
  duration?: number
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const colors = {
    success: 'bg-emerald-500/30 backdrop-blur-md border-emerald-600',
    error: 'bg-red-700/30 backdrop-blur-md border-rose-500',
  }

  const icons = {
    success: '✓',
    error: '🚨',
  }

  return (
    <div
      className={`fixed top-6 right-6 z-50 ${colors[type]} text-white px-6 py-4 rounded-lg shadow-2xl border
        animate-[slideIn_0.3s_ease-out] flex items-center gap-3 min-w-75 max-w-md`}
      style={{
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      <div className="text-2xl font-bold">{icons[type]}</div>
      <div className="flex-1 font-medium">{message}</div>
      <button
        onClick={onClose}
        className="hover:bg-white/20 rounded p-1 transition-colors"
        aria-label="Fechar"
      >
        ✕
      </button>
    </div>
  )
}

export default Toast
