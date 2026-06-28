import type { ReadingPlan } from '../types'

/** Total de capítulos do livro de Êxodo. */
export const EXODUS_CHAPTERS = 40

/** Data de hoje no formato ISO yyyy-mm-dd (horário local). */
export function todayISO(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Planos disponíveis por padrão (na primeira execução). */
export function defaultPlans(): ReadingPlan[] {
  return [
    {
      id: 'exodo-1cap-dia',
      name: 'Êxodo — 1 capítulo por dia',
      book: 'Êxodo',
      totalChapters: EXODUS_CHAPTERS,
      startDate: todayISO(),
      active: true,
    },
  ]
}
