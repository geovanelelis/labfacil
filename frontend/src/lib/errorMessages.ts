export const getErrorMessage = (errorMessage: string): string => {
  const errorMap: { [key: string]: string } = {
    'Reserva fora do horário de funcionamento do laboratório.':
      '⏰ A reserva está fora do horário de funcionamento do laboratório. Verifique os horários disponíveis.',
    'A reserva deve ser solicitada com pelo menos 24 horas de antecedência.':
      '📅 A reserva deve ser solicitada com pelo menos 24 horas de antecedência.',
    'Reserva duplicada para o mesmo professor e turma.':
      '⚠️ Este professor já possui uma reserva no mesmo horário para esta turma.',
    'O laboratório já está reservado neste intervalo.':
      '🔒 O laboratório já está reservado neste intervalo de horário. Escolha outro horário.',
    'A data/hora de início deve ser anterior à data/hora de fim.':
      '⌚ A data/hora de início deve ser anterior à data/hora de fim.',
    'Status inválido.': '❌ O status da reserva é inválido.',
    'Não é possível alterar reserva concluída.':
      '🔐 Não é possível alterar uma reserva que já foi concluída.',
  }

  if (errorMap[errorMessage]) {
    return errorMap[errorMessage]
  }

  for (const [key, value] of Object.entries(errorMap)) {
    if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
      return value
    }
  }

  return `❌ Erro: ${errorMessage}`
}
