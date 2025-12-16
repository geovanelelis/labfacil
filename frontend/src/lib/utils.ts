export const formatDateTime = (timestamp: string): string => {
  const date = new Date(timestamp)
  if (isNaN(date.getTime())) return 'Inválido'
  return date.toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

export const formatDate = (timestamp: string): string => {
  const date = new Date(timestamp)
  if (isNaN(date.getTime())) return 'Inválido'
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp)
  if (isNaN(date.getTime())) return 'Inválido'
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'PENDENTE':
      return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'CANCELADO':
      return 'bg-rose-100 text-rose-800 border-rose-200'
    case 'CONCLUIDO':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200'
  }
}

export const getStatusIcon = (status: string): string => {
  switch (status) {
    case 'PENDENTE':
      return '⏳'
    case 'CANCELADO':
      return '❌'
    case 'CONCLUIDO':
      return '✅'
    default:
      return '📋'
  }
}
