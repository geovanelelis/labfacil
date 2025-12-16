import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { Laboratorio } from '../types'

interface LabCardProps {
  laboratorio: Laboratorio
  index: number
}

const LabCard: React.FC<LabCardProps> = ({ laboratorio, index }) => {
  const navigate = useNavigate()

  const handleReservar = () => {
    navigate(`/nova-reserva?lab=${laboratorio.codigo}`)
  }

  return (
    <div
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden hover:border-slate-700/60 transition-all shadow-lg hover:shadow-xl group flex flex-col h-full"
      style={{
        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
      }}
    >
      {/* Header */}
      <div className="bg-linear-to-r from-sky-400/50 to-sky-600/20 p-4 relative overflow-hidden min-h-22 flex flex-col justify-center transition-colors">
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold text-white flex-1">{laboratorio.nome}</h3>
            <span className="text-xs font-semibold bg-white/20 text-white px-3 py-1 rounded-full whitespace-nowrap">
              Cód. {laboratorio.codigo}
            </span>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6 flex flex-col flex-1 justify-between gap-6">
        <div className="space-y-6">
          <div>
            <p className="text-xs text-slate-400 font-medium mb-1">Especialidade</p>
            <p className="text-slate-100 font-semibold">{laboratorio.especialidade}</p>
          </div>

          {laboratorio.horario_funcionamento && (
            <div>
              <p className="text-xs text-slate-400 font-medium mb-1">Horário de Funcionamento</p>
              <p className="text-slate-100 font-semibold">{laboratorio.horario_funcionamento}</p>
            </div>
          )}
        </div>

        {/* Botão de reserva - sempre no final */}
        <button
          onClick={handleReservar}
          className="w-full bg-linear-to-r from-sky-500 to-sky-700 text-white font-medium py-3 px-4 
            rounded-lg hover:from-sky-500 hover:to-sky-600 transition-colors text-sm shadow-md hover:shadow-lg cursor-pointer"
        >
          Reservar
        </button>
      </div>
    </div>
  )
}

export default LabCard
