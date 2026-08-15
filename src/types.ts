/** Dia da semana: 0 = domingo ... 6 = sábado (igual a Date.getDay()). */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

/** Uma leitura predefinida (um dia) de um plano baseado em passagens. */
export interface Reading {
  /** Trecho lido, sem o nome do livro, ex: "1:1–12". */
  passage: string
  /** Tema/título do dia. */
  theme: string
}

interface PlanBase {
  id: string
  /** Nome exibido do plano. */
  name: string
  /** Livro lido, ex: "Tiago". */
  book: string
  /** Data de início do plano (ISO yyyy-mm-dd). */
  startDate: string
  /** Apenas um plano fica ativo por vez. */
  active: boolean
}

/** Plano baseado em capítulos: N capítulos por dia. */
export interface ChapterPlan extends PlanBase {
  kind: 'chapters'
  /** Total de capítulos do livro. */
  totalChapters: number
  /** Quantos capítulos são lidos por dia (>= 1). */
  chaptersPerDay: number
}

/** Plano baseado em passagens: uma lista fixa de leituras. */
export interface ReadingListPlan extends PlanBase {
  kind: 'readings'
  /** Leituras predefinidas, uma por dia, na ordem. */
  readings: Reading[]
}

export type ReadingPlan = ChapterPlan | ReadingListPlan

export interface Settings {
  /** Dias da semana que o plano deve pular. */
  skipWeekdays: Weekday[]
}

/**
 * Progresso de leitura.
 * planId -> (chave da unidade -> data ISO em que foi marcada como lida).
 * A "unidade" é o número do capítulo (planos por capítulo) ou o índice da
 * leitura (planos por passagem).
 */
export type Progress = Record<string, Record<string, string>>

export interface AppState {
  plans: ReadingPlan[]
  settings: Settings
  progress: Progress
}
