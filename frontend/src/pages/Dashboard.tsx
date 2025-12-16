import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import StatCard from '../components/StatCard'
import { useLabFacilData } from '../hooks/useLabFacilData'
import { formatDate, formatTime, getStatusColor } from '../lib/utils'
import type { DashboardStats } from '../types'
import { Blocks, ClipboardList, Plus } from 'lucide-react'

const Dashboard: React.FC = () => {
  const { laboratorios, professores, reservas, loading, error } = useLabFacilData()

  // Calcular estatísticas
  const stats: DashboardStats = useMemo(() => {
    return {
      totalLaboratorios: laboratorios.length,
      reservasPendentes: reservas.filter((r) => r.status === 'PENDENTE').length,
      reservasConcluidas: reservas.filter((r) => r.status === 'CONCLUIDO').length,
      reservasCanceladas: reservas.filter((r) => r.status === 'CANCELADO').length,
      totalProfessores: professores.length,
    }
  }, [laboratorios, professores, reservas])

  // Próximas reservas (pendentes ordenadas por data)
  const proximasReservas = useMemo(() => {
    return reservas
      .filter((r) => r.status === 'PENDENTE')
      .sort(
        (a, b) => new Date(a.data_hora_inicio).getTime() - new Date(b.data_hora_inicio).getTime()
      )
      .slice(0, 8)
  }, [reservas])

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-slate-600 border-t-slate-300 mb-4"></div>
          <p className="text-base text-slate-300 font-medium">Carregando dados...</p>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Dashboard</h1>
          <p className="text-slate-400">Bem-vindo ao sistema de gerenciamento de laboratórios</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Laboratórios"
            value={stats.totalLaboratorios}
            status="default"
            delay={0.1}
          />
          <StatCard
            title="Pendentes"
            value={stats.reservasPendentes}
            status="pendente"
            delay={0.2}
          />
          <StatCard
            title="Concluídas"
            value={stats.reservasConcluidas}
            status="concluido"
            delay={0.3}
          />
          <StatCard
            title="Canceladas"
            value={stats.reservasCanceladas}
            status="cancelado"
            delay={0.4}
          />
        </div>

        {/* Próximas Reservas */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden mb-8 shadow-lg">
          <div className="border-b border-slate-700/50 px-6 py-4 flex items-center justify-between bg-slate-800/80">
            <div>
              <h2 className="text-xl font-bold text-slate-100">Próximas Reservas</h2>
              <p className="text-sm text-slate-400">Agenda de laboratórios pendentes</p>
            </div>
            <Link
              to="/reservas"
              className="text-sm font-medium text-slate-300 hover:text-slate-100 transition-colors"
            >
              Ver Todas →
            </Link>
          </div>

          <div className="p-6">
            {proximasReservas.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-700/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-slate-400 text-sm font-medium mb-4">
                  Nenhuma reserva pendente no momento
                </p>
                <Link
                  to="/nova-reserva"
                  className="inline-block bg-linear-to-r from-green-500 to-green-600 text-white font-medium py-2 px-6 rounded-lg hover:from-green-600 hover:to-green-700 transition-all text-sm shadow-lg"
                >
                  Criar Nova Reserva
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {proximasReservas.map((reserva) => (
                  <div
                    key={reserva.codigo}
                    className="flex items-center justify-between p-4 rounded-lg 
                      border border-slate-700/50 hover:border-slate-600/70 bg-slate-700/30 hover:bg-slate-700/50 transition-all"
                  >
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-100 text-sm mb-1">
                        {reserva.laboratorio_nome}
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        <span className="text-xs text-slate-400">
                          Prof. {reserva.professor_nome}
                        </span>
                        <span className="text-xs text-slate-400">{reserva.disciplina_nome}</span>
                        <span className="text-xs text-slate-400">{reserva.turma_nome}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-200">
                          {formatDate(reserva.data_hora_inicio)}
                        </p>
                        <p className="text-xs text-slate-400">
                          {formatTime(reserva.data_hora_inicio)} -{' '}
                          {formatTime(reserva.data_hora_fim)}
                        </p>
                      </div>
                      <span
                        className={`${getStatusColor(
                          reserva.status
                        )} px-3 py-1 rounded-full text-xs font-bold`}
                      >
                        {reserva.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/nova-reserva"
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 hover:border-slate-600/70 transition-all shadow-lg hover:shadow-xl group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-linear-to-br from-green-500 to-green-600 text-white rounded-lg flex items-center justify-center shrink-0 group-hover:from-green-600 group-hover:to-green-700 transition-all">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-sm mb-1">Nova Reserva</h3>
                <p className="text-xs text-slate-400">Agendar novo laboratório</p>
              </div>
            </div>
          </Link>

          <Link
            to="/laboratorios"
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 hover:border-slate-600/70 transition-all shadow-lg hover:shadow-xl group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-lg flex items-center justify-center shrink-0 group-hover:from-blue-600 group-hover:to-blue-700 transition-all">
                <Blocks className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-sm mb-1">Laboratórios</h3>
                <p className="text-xs text-slate-400">Ver disponibilidade</p>
              </div>
            </div>
          </Link>

          <Link
            to="/reservas"
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 hover:border-slate-600/70 transition-all shadow-lg hover:shadow-xl group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-purple-600 text-white rounded-lg flex items-center justify-center shrink-0 group-hover:from-purple-600 group-hover:to-purple-700 transition-all">
                <ClipboardList className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-sm mb-1">Minhas Reservas</h3>
                <p className="text-xs text-slate-400">Gerenciar agendamentos</p>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
