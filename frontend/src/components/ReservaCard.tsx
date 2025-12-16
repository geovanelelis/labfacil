import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { Reserva } from '../types'
import { formatDate, formatTime } from '../lib/utils'

interface ReservaCardProps {
  reserva: Reserva
  onCancelar: (codigo: number) => void
  onExcluir?: (codigo: number) => void
  onEditar?: (codigo: number) => void
}

const ReservaCard: React.FC<ReservaCardProps> = ({ reserva, onCancelar, onExcluir}) => {
  const navigate = useNavigate()

  const handleEdit = () => {
    navigate(`/nova-reserva?edit=${reserva.codigo}`)
  }

  const handleExcluir = () => {
    if (onExcluir) {
      onExcluir(reserva.codigo)
    }
  }
  const statusConfig = {
    PENDENTE: { gradient: 'from-amber-500 to-amber-600', color: 'text-amber-100' },
    CONCLUIDO: { gradient: 'from-green-400 to-green-600', color: 'text-green-200' },
    CANCELADO: { gradient: 'from-red-500 to-red-700', color: 'text-red-200' },
  }

  const config = statusConfig[reserva.status as keyof typeof statusConfig] || statusConfig.PENDENTE

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 overflow-hidden hover:shadow-lg transition-all hover:border-slate-600/50">
      <div
        className={`bg-linear-to-r from-slate-700/80 to-slate-700 px-6 py-4 flex items-center justify-between`}
      >
        <div>
          <h3 className="font-bold text-white text-sm">{reserva.laboratorio_nome}</h3>
          <p className="text-xs text-white/80 mt-1">Reserva #{reserva.codigo}</p>
        </div>
        <span
          className={`${config.color} px-3 py-1.5 bg-linear-to-r ${config.gradient} rounded-full text-xs font-bold backdrop-blur-sm`}
        >
          {reserva.status}
        </span>
      </div>

      {/* Conteúdo */}
      <div className="p-6 space-y-4">
        {/* Data e Hora */}
        <div>
          <p className="text-xs text-slate-400 font-medium mb-1">Período</p>
          <p className="text-slate-100 font-semibold text-sm">
            {formatDate(reserva.data_hora_inicio)}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {formatTime(reserva.data_hora_inicio)} - {formatTime(reserva.data_hora_fim)}
          </p>
        </div>

        {/* Professor */}
        <div>
          <p className="text-xs text-slate-400 font-medium mb-1">Professor</p>
          <p className="text-slate-100 font-semibold text-sm">{reserva.professor_nome}</p>
        </div>

        {/* Disciplina e Turma */}
        <div>
          <p className="text-xs text-slate-400 font-medium mb-1">Disciplina / Turma</p>
          <p className="text-slate-100 font-semibold text-sm">{reserva.disciplina_nome}</p>
          <p className="text-xs text-slate-400 mt-1">{reserva.turma_nome}</p>
        </div>

        {/* Ações */}
        {reserva.status === 'PENDENTE' ? (
          <div className="flex gap-2 pt-4 border-t border-slate-700/50">
            <button
              onClick={handleEdit}
              className="flex-1 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-4 
                rounded-lg transition-colors text-sm shadow-md cursor-pointer"
            >
              Editar
            </button>
            <button
              onClick={() => onCancelar(reserva.codigo)}
              className="flex-1 bg-linear-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm shadow-md cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <div className="flex pt-4 border-t border-slate-700/50">
            <button
              onClick={handleExcluir}
              className="flex-1 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm shadow-md cursor-pointer"
            >
              Excluir
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReservaCard
