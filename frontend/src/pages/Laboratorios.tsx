import React, { useState, useMemo } from 'react'
import { useLabFacilData } from '../hooks/useLabFacilData'
import LabCard from '../components/LabCard'

const Laboratorios: React.FC = () => {
  const { laboratorios, loading, error } = useLabFacilData()
  const [searchTerm, setSearchTerm] = useState('')

  // Filtrar laboratórios por busca
  const filteredLabs = useMemo(() => {
    if (!searchTerm) return laboratorios

    const term = searchTerm.toLowerCase()
    return laboratorios.filter(
      (lab) =>
        lab.nome.toLowerCase().includes(term) ||
        lab.especialidade.toLowerCase().includes(term) ||
        lab.codigo.toString().includes(term)
    )
  }, [laboratorios, searchTerm])

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-slate-600 border-t-slate-300 mb-4"></div>
          <p className="text-base text-slate-300 font-medium">Carregando laboratórios...</p>
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Laboratórios</h1>
          <p className="text-slate-400">Conheça os laboratórios disponíveis e faça suas reservas</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 shadow-lg">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nome, especialidade ou código..."
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
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-3">
            {filteredLabs.length} laboratório{filteredLabs.length !== 1 ? 's' : ''} encontrado
            {filteredLabs.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Labs Grid */}
        {filteredLabs.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-12 text-center shadow-lg">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-100 mb-2">Nenhum laboratório encontrado</h2>
            <p className="text-slate-400 text-sm mb-6">Tente ajustar os termos de busca</p>
            <button
              onClick={() => setSearchTerm('')}
              className="bg-linear-to-r from-slate-600 to-slate-700 text-white font-medium py-2 px-6 rounded-lg 
                hover:from-slate-500 hover:to-slate-600 transition-all text-sm shadow-md"
            >
              Limpar Busca
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLabs.map((lab, index) => (
              <LabCard key={lab.codigo} laboratorio={lab} index={index} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Laboratorios
