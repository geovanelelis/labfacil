import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLabFacilData } from '../hooks/useLabFacilData'
import ReservaCard from '../components/ReservaCard'
import Toast from '../components/Toast'
import { formatDateTime, getStatusColor } from '../lib/utils'
import { Calendar, Plus, Search } from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_URL

type ViewMode = 'grid' | 'table'
type StatusFilter = 'todas' | 'PENDENTE' | 'CONCLUIDO' | 'CANCELADO'

const Reservas: React.FC = () => {
  const { reservas, loading, error, fetchData } = useLabFacilData()
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todas')
  const [searchTerm, setSearchTerm] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Filtrar e ordenar reservas
  const filteredReservas = useMemo(() => {
    let filtered = reservas

    if (statusFilter !== 'todas') {
      filtered = filtered.filter((r) => r.status === statusFilter)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (r) =>
          r.laboratorio_nome?.toLowerCase().includes(term) ||
          r.professor_nome?.toLowerCase().includes(term) ||
          r.disciplina_nome?.toLowerCase().includes(term) ||
          r.turma_nome?.toLowerCase().includes(term)
      )
    }

    return filtered.sort((a, b) => b.codigo - a.codigo)
  }, [reservas, statusFilter, searchTerm])

  // Cancelar reserva
  const handleCancelar = async (codigo: number) => {
    if (!window.confirm('Tem certeza que deseja cancelar esta reserva?')) {
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/reservas/${codigo}/cancelar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao cancelar reserva.')
      }

      setToast({ message: 'Reserva cancelada com sucesso!', type: 'success' })
      fetchData()
    } catch (err) {
      setToast({ message: `Erro: ${(err as Error).message}`, type: 'error' })
    }
  }

  // Excluir reserva
  const handleExcluir = async (codigo: number) => {
    if (
      !window.confirm(
        'Tem certeza que deseja excluir esta reserva? Esta ação não pode ser desfeita.'
      )
    ) {
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/reservas/${codigo}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao excluir reserva.')
      }

      setToast({ message: 'Reserva excluída com sucesso!', type: 'success' })
      fetchData()
    } catch (err) {
      setToast({ message: `Erro: ${(err as Error).message}`, type: 'error' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-slate-600 border-t-slate-300 mb-4"></div>
          <p className="text-base text-slate-300 font-medium">Carregando reservas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-100 mb-2">Erro ao Carregar</h2>
            <p className="text-slate-400 text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-100 mb-2">Minhas Reservas</h1>
            <p className="text-slate-400">Gerencie suas reservas de laboratórios</p>
          </div>
          <Link
            to="/nova-reserva"
            className="flex items-center gap-2 bg-linear-to-r from-green-500 to-green-600 text-white font-medium py-3 px-6 rounded-lg 
              hover:from-green-600 hover:to-green-700 transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span className='max-sm:hidden'>Nova Reserva</span>
          </Link>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 mb-8 shadow-lg">
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-2">BUSCAR</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Laboratório, professor, disciplina..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 text-base bg-slate-700/50 border border-slate-600/50 text-slate-100 placeholder-slate-500 rounded-lg 
                      focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/50 
                      transition-all duration-300"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 
                        transition-colors"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* View Mode Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">VISUALIZAÇÃO</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all text-sm ${
                      viewMode === 'grid'
                        ? 'bg-linear-to-r from-slate-600 to-slate-700 text-white shadow-md'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700/70 border border-slate-600/50'
                    }`}
                  >
                    Cards
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all text-sm ${
                      viewMode === 'table'
                        ? 'bg-linear-to-r from-slate-600 to-slate-700 text-white shadow-md'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700/70 border border-slate-600/50'
                    }`}
                  >
                    Tabela
                  </button>
                </div>
              </div>
            </div>

            {/* Status Filters */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-3">STATUS</label>
              <div className="flex flex-wrap gap-2">
                {(['todas', 'PENDENTE', 'CONCLUIDO', 'CANCELADO'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`py-2 px-4 rounded-lg font-medium transition-all text-sm ${
                      statusFilter === status
                        ? 'bg-linear-to-r from-slate-600 to-slate-700 text-white shadow-md'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700/70 border border-slate-600/50'
                    }`}
                  >
                    {status === 'todas' ? 'Todas' : status}
                  </button>
                ))}
              </div>
            </div>

            {/* Results count */}
            <p className="text-xs text-slate-400 font-medium">
              {filteredReservas.length} reserva{filteredReservas.length !== 1 ? 's' : ''} encontrada
              {filteredReservas.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Content */}
        {filteredReservas.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-12 text-center shadow-lg">
            <div className="w-16 h-16 bg-slate-700/50 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-slate-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-100 mb-2">Nenhuma reserva encontrada</h2>
            <p className="text-slate-400 text-sm mb-6">
              {searchTerm || statusFilter !== 'todas'
                ? 'Tente ajustar os filtros ou fazer uma nova busca'
                : 'Você ainda não tem reservas. Comece criando uma!'}
            </p>
            {searchTerm || statusFilter !== 'todas' ? (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('todas')
                }}
                className="bg-linear-to-r from-slate-600 to-slate-700 text-white font-medium py-2 px-6 rounded-lg 
                  hover:from-slate-500 hover:to-slate-600 transition-all text-sm shadow-md"
              >
                Limpar Filtros
              </button>
            ) : (
              <Link
                to="/nova-reserva"
                className="inline-block bg-linear-to-r from-green-500 to-green-600 text-white font-medium py-2 px-6 rounded-lg 
                  hover:from-green-600 hover:to-green-700 transition-all text-sm shadow-md"
              >
                Criar Nova Reserva
              </Link>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReservas.map((reserva) => (
              <div key={reserva.codigo}>
                <ReservaCard
                  reserva={reserva}
                  onCancelar={handleCancelar}
                  onExcluir={handleExcluir}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-700/50">
                <thead className="bg-slate-800/80">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase">
                      Laboratório
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase">
                      Início
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase">
                      Fim
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase">
                      Professor / Turma
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-300 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {filteredReservas.map((reserva) => (
                    <tr
                      key={reserva.codigo}
                      className="hover:bg-slate-700/30 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-slate-100">
                          {reserva.laboratorio_nome}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 font-medium">
                        {formatDateTime(reserva.data_hora_inicio)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 font-medium">
                        {formatDateTime(reserva.data_hora_fim)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-slate-100">{reserva.professor_nome}</div>
                          <div className="text-slate-400 text-xs">{reserva.turma_nome}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`${getStatusColor(
                            reserva.status
                          )} px-3 py-1 rounded-full text-xs font-bold`}
                        >
                          {reserva.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {reserva.status === 'PENDENTE' && (
                          <button
                            onClick={() => handleCancelar(reserva.codigo)}
                            className="text-red-400 hover:text-red-300 font-medium transition-colors 
                              text-sm hover:underline"
                          >
                            Cancelar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Reservas
