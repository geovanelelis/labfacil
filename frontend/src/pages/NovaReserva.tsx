import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useLabFacilData } from '../hooks/useLabFacilData'
import Toast from '../components/Toast'
import { getErrorMessage } from '../lib/errorMessages'
import type { CriarReserva } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL

const initialFormData: CriarReserva = {
  data_hora_inicio: '',
  data_hora_fim: '',
  cpf_professor: '',
  cod_disciplina: 0,
  cod_turma: 0,
  cod_laboratorio: 0,
}

const formatDateForInput = (isoString: string): string => {
  const date = new Date(isoString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

const NovaReserva: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const {
    laboratorios,
    professores,
    disciplinas,
    turmas,
    loading: dataLoading,
    reservas,
  } = useLabFacilData()

  const [formData, setFormData] = useState<CriarReserva>(initialFormData)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [reservaId, setReservaId] = useState<number | null>(null)

  // Detectar modo de edição e laboratório pré-selecionado
  useEffect(() => {
    const editParam = searchParams.get('edit')
    const labParam = searchParams.get('lab')

    if (editParam) {
      setIsEditing(true)
      setReservaId(parseInt(editParam, 10))
    } else {
      setIsEditing(false)
      setReservaId(null)

      if (labParam && laboratorios.length > 0) {
        const labCodigo = parseInt(labParam, 10)
        if (laboratorios.some((lab) => lab.codigo === labCodigo)) {
          setFormData({ ...initialFormData, cod_laboratorio: labCodigo })
        }
      } else {
        setFormData(initialFormData)
      }
    }
  }, [searchParams, laboratorios])

  // Pré-carrega dados da reserva quando está em modo de edição
  useEffect(() => {
    if (isEditing && reservaId) {
      const reservaToEdit = reservas.find((r) => r.codigo === reservaId)
      if (reservaToEdit) {
        setFormData({
          data_hora_inicio: formatDateForInput(reservaToEdit.data_hora_inicio),
          data_hora_fim: formatDateForInput(reservaToEdit.data_hora_fim),
          cpf_professor: reservaToEdit.cpf_professor,
          cod_disciplina: reservaToEdit.cod_disciplina,
          cod_turma: reservaToEdit.cod_turma,
          cod_laboratorio: reservaToEdit.cod_laboratorio,
        })
      }
    }
  }, [isEditing, reservaId, reservas])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: name.startsWith('cod_') ? Number(value) || 0 : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validação
    if (
      formData.cod_laboratorio === 0 ||
      formData.cpf_professor === '' ||
      formData.cod_disciplina === 0 ||
      formData.cod_turma === 0 ||
      !formData.data_hora_inicio ||
      !formData.data_hora_fim
    ) {
      setToast({ message: 'Preencha todos os campos obrigatórios.', type: 'error' })
      setLoading(false)
      return
    }

    const inicio = new Date(formData.data_hora_inicio)
    const fim = new Date(formData.data_hora_fim)
    if (fim <= inicio) {
      setToast({ message: 'A data de término deve ser posterior à data de início.', type: 'error' })
      setLoading(false)
      return
    }

    try {
      const url =
        isEditing && reservaId
          ? `${API_BASE_URL}/reservas/${reservaId}`
          : `${API_BASE_URL}/reservas`
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMsg = getErrorMessage(data.message || data.error || 'Erro desconhecido.')
        throw new Error(errorMsg)
      }

      const successMsg = isEditing
        ? 'Reserva atualizada com sucesso!'
        : 'Reserva criada com sucesso!'
      setToast({ message: successMsg, type: 'success' })
      setTimeout(() => {
        navigate('/reservas')
      }, 2000)
    } catch (err) {
      const errorMessage = (err as Error).message
      setToast({ message: errorMessage, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-slate-600 border-t-slate-300 mb-4"></div>
          <p className="text-base text-slate-300 font-medium">Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">
            {isEditing ? 'Editar Reserva' : 'Nova Reserva'}
          </h1>
          <p className="text-slate-400">
            {isEditing
              ? 'Atualize os dados da sua reserva'
              : 'Preencha os dados para agendar um laboratório'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden shadow-lg">
            {/* Form Header */}
            <div className="border-b border-slate-700/50 px-6 py-4 bg-linear-to-r from-slate-800 to-slate-800/50">
              <h2 className="text-lg font-bold text-slate-100">
                {isEditing ? 'Editar Reserva' : 'Dados da Reserva'}
              </h2>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-6">
              {/* Laboratório */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Laboratório *</label>
                <select
                  name="cod_laboratorio"
                  value={formData.cod_laboratorio}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 text-base bg-slate-700/50 border border-slate-600/50 text-slate-100 placeholder-slate-500 rounded-lg 
                    focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/50 
                    transition-all duration-300"
                >
                  <option value={0}>Selecione um laboratório...</option>
                  {laboratorios.map((lab) => (
                    <option key={lab.codigo} value={lab.codigo}>
                      {lab.nome} - {lab.especialidade}
                    </option>
                  ))}
                </select>
              </div>

              {/* Data e Hora */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    Data e Hora de Início *
                  </label>
                  <input
                    type="datetime-local"
                    name="data_hora_inicio"
                    value={formData.data_hora_inicio}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 text-base bg-slate-700/50 border border-slate-600/50 text-slate-100 placeholder-slate-500 rounded-lg 
                      focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/50 
                      transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    Data e Hora de Término *
                  </label>
                  <input
                    type="datetime-local"
                    name="data_hora_fim"
                    value={formData.data_hora_fim}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 text-base bg-slate-700/50 border border-slate-600/50 text-slate-100 placeholder-slate-500 rounded-lg 
                      focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/50 
                      transition-all duration-300"
                  />
                </div>
              </div>

              {/* Professor */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Professor *</label>
                <select
                  name="cpf_professor"
                  value={formData.cpf_professor}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 text-base bg-slate-700/50 border border-slate-600/50 text-slate-100 placeholder-slate-500 rounded-lg 
                    focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/50 
                    transition-all duration-300"
                >
                  <option value="">Selecione um professor...</option>
                  {professores.map((prof) => (
                    <option key={prof.cpf} value={prof.cpf}>
                      {prof.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Disciplina e Turma */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    Disciplina *
                  </label>
                  <select
                    name="cod_disciplina"
                    value={formData.cod_disciplina}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 text-base bg-slate-700/50 border border-slate-600/50 text-slate-100 placeholder-slate-500 rounded-lg 
                      focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/50 
                      transition-all duration-300"
                  >
                    <option value={0}>Selecione uma disciplina...</option>
                    {disciplinas.map((disc) => (
                      <option key={disc.codigo} value={disc.codigo}>
                        {disc.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Turma *</label>
                  <select
                    name="cod_turma"
                    value={formData.cod_turma}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 text-base bg-slate-700/50 border border-slate-600/50 text-slate-100 placeholder-slate-500 rounded-lg 
                      focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/50 
                      transition-all duration-300"
                  >
                    <option value={0}>Selecione uma turma...</option>
                    {turmas.map((turma) => (
                      <option key={turma.codigo} value={turma.codigo}>
                        {turma.nome} ({turma.ano})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
                <p className="text-sm text-blue-300">
                  <strong>Dica:</strong> Certifique-se de que o horário escolhido não conflita com
                  outras reservas do mesmo laboratório.
                </p>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="border-t border-slate-700/50 bg-slate-800/50 px-6 py-4 flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/reservas')}
                disabled={loading}
                className="flex-1 bg-linear-to-r from-red-500 to-red-600 text-white font-medium py-3 px-4 rounded-lg 
                  hover:from-red-600 hover:to-red-700 transition-colors text-sm shadow-md cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-linear-to-r from-green-500 to-green-600 text-white font-medium py-3 px-4 rounded-lg 
                  hover:from-green-600 hover:to-green-700 transition-colors 
                  flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Processando...
                  </>
                ) : isEditing ? (
                  'Atualizar Reserva'
                ) : (
                  'Confirmar Reserva'
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}

export default NovaReserva
