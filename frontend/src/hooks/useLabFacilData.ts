import { useCallback, useEffect, useState } from 'react'
import type { Disciplina, Laboratorio, Professor, Reserva, Turma } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL

interface LabFacilData {
  laboratorios: Laboratorio[]
  professores: Professor[]
  disciplinas: Disciplina[]
  turmas: Turma[]
  reservas: Reserva[]
  loading: boolean
  error: string | null
  fetchData: () => Promise<void>
}

export const useLabFacilData = (): LabFacilData => {
  const [data, setData] = useState<Omit<LabFacilData, 'loading' | 'error' | 'fetchData'>>({
    laboratorios: [],
    professores: [],
    disciplinas: [],
    turmas: [],
    reservas: [],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const urls = [
        `${API_BASE_URL}/reservas`,
        `${API_BASE_URL}/laboratorios`,
        `${API_BASE_URL}/professores`,
        `${API_BASE_URL}/disciplinas`,
        `${API_BASE_URL}/turmas`,
      ]

      const responses = await Promise.all(urls.map((url) => fetch(url)))
      const dataResults = await Promise.all(responses.map((res) => res.json()))

      setData({
        reservas: dataResults[0],
        laboratorios: dataResults[1],
        professores: dataResults[2],
        disciplinas: dataResults[3],
        turmas: dataResults[4],
      })
    } catch (err) {
      console.error('Erro ao buscar dados:', err)
      setError('Erro ao buscar dados do LabFácil.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { ...data, loading, error, fetchData }
}
