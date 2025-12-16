export interface Laboratorio {
  codigo: number
  nome: string
  especialidade: string
  horario_funcionamento?: string
}

export interface Professor {
  cpf: string
  nome: string
  email?: string
}

export interface Disciplina {
  codigo: number
  nome: string
  carga_horaria?: number
}

export interface Turma {
  codigo: number
  nome: string
  ano: number
  semestre?: number
}

export interface Reserva {
  codigo: number
  data_hora_inicio: string
  data_hora_fim: string
  cpf_professor: string
  cod_disciplina: number
  cod_turma: number
  cod_laboratorio: number
  status: 'PENDENTE' | 'CONCLUIDO' | 'CANCELADO'
  professor_nome?: string
  laboratorio_nome?: string
  disciplina_nome?: string
  turma_nome?: string
  created_at?: string
}

export interface CriarReserva {
  data_hora_inicio: string
  data_hora_fim: string
  cpf_professor: string
  cod_disciplina: number
  cod_turma: number
  cod_laboratorio: number
}

export interface DashboardStats {
  totalLaboratorios: number
  reservasPendentes: number
  reservasConcluidas: number
  reservasCanceladas: number
  totalProfessores: number
}
