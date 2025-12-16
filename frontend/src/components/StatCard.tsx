import React from 'react'

interface StatCardProps {
  title: string
  value: number
  icon?: React.ReactNode
  status?: 'default' | 'pendente' | 'concluido' | 'cancelado'
  delay?: number
}

const StatCard: React.FC<StatCardProps> = ({ title, value, status = 'default', delay = 0 }) => {
  const statusGradient = {
    default: 'from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700',
    pendente: 'from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 ',
    concluido: 'from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 ',
    cancelado: 'from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 ',
  }

  return (
    <div
      className={`bg-linear-to-br ${statusGradient[status]} rounded-xl p-6 transition-all duration-300 border border-slate-600/50 shadow-lg hover:shadow-xl`}
      style={{
        animation: `fadeInUp 0.6s ease-out ${delay}s both`,
      }}
    >
      <div className="flex flex-col gap-3">
        <p className="text-base font-medium text-slate-200">{title}</p>
        <p className="text-4xl font-bold text-slate-100">{value}</p>
      </div>
    </div>
  )
}

export default StatCard
