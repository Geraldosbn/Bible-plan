import type { Reading, ReadingPlan } from '../types'

/** Data de hoje no formato ISO yyyy-mm-dd (horário local). */
export function todayISO(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Gera leituras de um mesmo livro a partir de uma lista de trechos. */
function readingsOf(book: string, passages: string[]): Reading[] {
  return passages.map((passage) => ({ book, passage }))
}

/**
 * Cronograma combinado das cartas de João (1, 2 e 3 João), em sequência.
 * 25 leituras por passagens, sem tema.
 */
export const JOHN_LETTERS_READINGS: Reading[] = [
  ...readingsOf('1 João', [
    '1:1–4', '1:5–10',
    '2:1–6', '2:7–11', '2:12–14', '2:15–17', '2:18–26', '2:27–29',
    '3:1–6', '3:7–10', '3:11–24',
    '4:1–6', '4:7–21',
    '5:1–5', '5:6–12', '5:13–19', '5:20–21',
  ]),
  ...readingsOf('2 João', ['1:1–3', '1:4–6', '1:7–11', '1:12–13']),
  ...readingsOf('3 João', ['1:1–4', '1:5–8', '1:9–12', '1:13–15']),
]

/** Planos disponíveis por padrão (na primeira execução). */
export function defaultPlans(): ReadingPlan[] {
  return [
    {
      kind: 'readings',
      id: 'cartas-de-joao',
      name: '1, 2 e 3 João',
      book: '1, 2 e 3 João',
      readings: JOHN_LETTERS_READINGS,
      startDate: todayISO(),
      active: true,
    },
  ]
}
