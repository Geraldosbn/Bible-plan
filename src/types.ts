/** Dia da semana: 0 = domingo ... 6 = sábado (igual a Date.getDay()). */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

/** Um plano de leitura. Hoje só existe Êxodo, mas a estrutura suporta vários. */
export interface ReadingPlan {
  id: string
  /** Nome exibido, ex: "Êxodo — 1 capítulo por dia". */
  name: string
  /** Livro lido. */
  book: string
  /** Total de capítulos = total de dias de leitura. */
  totalChapters: number
  /** Data de início do plano (ISO yyyy-mm-dd). */
  startDate: string
  /** Apenas um plano fica ativo por vez. */
  active: boolean
}

export interface Settings {
  /** Dias da semana que o plano deve pular. */
  skipWeekdays: Weekday[]
}

/**
 * Progresso de leitura.
 * planId -> (número do capítulo -> data ISO em que foi marcado como lido).
 */
export type Progress = Record<string, Record<number, string>>

export interface AppState {
  plans: ReadingPlan[]
  settings: Settings
  progress: Progress
}
