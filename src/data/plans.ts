import type { Reading, ReadingPlan } from '../types'

/** Data de hoje no formato ISO yyyy-mm-dd (horário local). */
export function todayISO(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Cronograma de leitura de Gálatas, dividido pelas seções temáticas
 * padrão das Bíblias em português (14 porções).
 */
export const GALATIANS_READINGS: Reading[] = [
  { passage: '1:1–5', theme: 'Saudação' },
  { passage: '1:6–10', theme: 'Não há outro evangelho' },
  { passage: '1:11–24', theme: 'Paulo chamado por Deus' },
  { passage: '2:1–10', theme: 'Paulo aceito pelos apóstolos' },
  { passage: '2:11–21', theme: 'Paulo confronta Pedro' },
  { passage: '3:1–14', theme: 'Fé ou observância da lei' },
  { passage: '3:15–25', theme: 'A lei e a promessa' },
  { passage: '3:26–4:7', theme: 'Filhos de Deus' },
  { passage: '4:8–20', theme: 'A preocupação de Paulo com os gálatas' },
  { passage: '4:21–31', theme: 'Agar e Sara' },
  { passage: '5:1–15', theme: 'Liberdade em Cristo' },
  { passage: '5:16–26', theme: 'A vida pelo Espírito' },
  { passage: '6:1–10', theme: 'Ajudar uns aos outros' },
  { passage: '6:11–18', theme: 'Conclusão' },
]

/** Planos disponíveis por padrão (na primeira execução). */
export function defaultPlans(): ReadingPlan[] {
  return [
    {
      kind: 'readings',
      id: 'galatas',
      name: 'Gálatas',
      book: 'Gálatas',
      readings: GALATIANS_READINGS,
      startDate: todayISO(),
      active: true,
    },
  ]
}
