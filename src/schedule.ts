import type { ReadingPlan, Weekday } from './types'

export interface ScheduledDay {
  /** Número do capítulo (1-indexado). */
  chapter: number
  /** Data agendada para a leitura. */
  date: Date
}

/** Converte "yyyy-mm-dd" em Date no horário local (evita o off-by-one do UTC). */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/**
 * Monta o cronograma do plano: cada capítulo cai no próximo dia válido,
 * pulando os dias da semana configurados.
 *
 * Se todos os 7 dias estiverem marcados para pular, não há dia válido —
 * retorna lista vazia para evitar laço infinito.
 */
export function buildSchedule(
  plan: ReadingPlan,
  skipWeekdays: Weekday[],
): ScheduledDay[] {
  if (skipWeekdays.length >= 7) return []

  const skip = new Set<number>(skipWeekdays)
  const days: ScheduledDay[] = []
  const cursor = parseISODate(plan.startDate)

  while (days.length < plan.totalChapters) {
    if (!skip.has(cursor.getDay())) {
      days.push({ chapter: days.length + 1, date: new Date(cursor) })
    }
    cursor.setDate(cursor.getDate() + 1)
  }

  return days
}

const WEEKDAY_LABELS = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
] as const

export function weekdayLabel(day: Weekday): string {
  return WEEKDAY_LABELS[day]
}

export const ALL_WEEKDAYS: Weekday[] = [0, 1, 2, 3, 4, 5, 6]

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'short',
  day: '2-digit',
  month: '2-digit',
})

export function formatDate(date: Date): string {
  return dateFormatter.format(date)
}

/** Verdadeiro se a data cai no dia de hoje (comparação por dia local). */
export function isToday(date: Date): boolean {
  const now = new Date()
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  )
}

/** Verdadeiro se a data já passou (anterior a hoje). */
export function isPast(date: Date): boolean {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return date.getTime() < today.getTime()
}
