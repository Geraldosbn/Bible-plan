import type { Reading, ReadingPlan } from '../types'

/** Data de hoje no formato ISO yyyy-mm-dd (horário local). */
export function todayISO(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Cronograma de leitura de Tiago (12 leituras, uma por dia). */
export const JAMES_READINGS: Reading[] = [
  { passage: '1:1–12', theme: 'A fé e a perseverança' },
  { passage: '1:13–18', theme: 'A tentação e a bondade de Deus' },
  { passage: '1:19–27', theme: 'Praticantes da Palavra' },
  { passage: '2:1–13', theme: 'Não façam discriminação entre as pessoas' },
  { passage: '2:14–26', theme: 'A fé e as obras' },
  { passage: '3:1–12', theme: 'O domínio da língua' },
  { passage: '3:13–18', theme: 'A sabedoria que vem do alto' },
  { passage: '4:1–10', theme: 'Humildade diante de Deus' },
  { passage: '4:11–17', theme: 'Não julguem e não se gloriem no amanhã' },
  { passage: '5:1–6', theme: 'Advertência aos ricos' },
  { passage: '5:7–12', theme: 'Paciência e perseverança' },
  { passage: '5:13–20', theme: 'O poder da oração' },
]

/** Planos disponíveis por padrão (na primeira execução). */
export function defaultPlans(): ReadingPlan[] {
  return [
    {
      kind: 'readings',
      id: 'tiago',
      name: 'Tiago',
      book: 'Tiago',
      readings: JAMES_READINGS,
      startDate: todayISO(),
      active: true,
    },
  ]
}
