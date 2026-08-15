import type { ReadingPlan, Weekday } from './types'

export interface ScheduledDay {
  /** Data agendada para a leitura. */
  date: Date
  /** Rótulo da leitura, ex: "Tiago 1:1–12" ou "Êxodo 1–3". */
  label: string
  /** Tema do dia (apenas planos por passagem). */
  theme?: string
  /** Chaves de progresso cobertas por este dia. */
  units: string[]
}

/** Converte "yyyy-mm-dd" em Date no horário local (evita o off-by-one do UTC). */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** Rótulo do intervalo de capítulos, ex: "Êxodo 4–6" ou "Êxodo 7". */
function chaptersLabel(book: string, chapters: number[]): string {
  if (chapters.length === 0) return book
  const first = chapters[0]
  const last = chapters[chapters.length - 1]
  return first === last ? `${book} ${first}` : `${book} ${first}–${last}`
}

/** Definição dos dias de leitura do plano, antes de atribuir datas. */
interface DayDef {
  label: string
  theme?: string
  units: string[]
}

function planDays(plan: ReadingPlan): DayDef[] {
  if (plan.kind === 'readings') {
    return plan.readings.map((r, index) => ({
      label: `${plan.book} ${r.passage}`,
      theme: r.theme,
      units: [String(index)],
    }))
  }

  const perDay = Math.max(1, Math.floor(plan.chaptersPerDay))
  const days: DayDef[] = []
  let next = 1
  while (next <= plan.totalChapters) {
    const last = Math.min(next + perDay - 1, plan.totalChapters)
    const chapters: number[] = []
    for (let c = next; c <= last; c++) chapters.push(c)
    days.push({
      label: chaptersLabel(plan.book, chapters),
      units: chapters.map(String),
    })
    next = last + 1
  }
  return days
}

/** Total de unidades marcáveis do plano (capítulos ou leituras). */
export function planTotalUnits(plan: ReadingPlan): number {
  return plan.kind === 'readings' ? plan.readings.length : plan.totalChapters
}

/**
 * Monta o cronograma do plano: cada dia de leitura é atribuído à próxima
 * data válida, pulando os dias da semana configurados.
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
  const defs = planDays(plan)
  const days: ScheduledDay[] = []
  const cursor = parseISODate(plan.startDate)

  let i = 0
  while (i < defs.length) {
    if (!skip.has(cursor.getDay())) {
      days.push({ ...defs[i], date: new Date(cursor) })
      i++
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
