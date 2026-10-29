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
 * Evangelho de João, dividido pelas seções da Sociedade Bíblica do Brasil.
 * Uma seção por dia, sem tema.
 */
export const JOHN_READINGS: Reading[] = readingsOf('João', [
  '1:1–18', '1:19–28', '1:29–34', '1:35–51',
  '2:1–12', '2:13–25',
  '3:1–21', '3:22–36',
  '4:1–26', '4:27–42', '4:43–54',
  '5:1–18', '5:19–47',
  '6:1–15', '6:16–21', '6:22–40', '6:41–59', '6:60–71',
  '7:1–13', '7:14–36', '7:37–52',
  '7:53–8:11', '8:12–30', '8:31–59',
  '9:1–41',
  '10:1–21', '10:22–42',
  '11:1–44', '11:45–57',
  '12:1–11', '12:12–19', '12:20–36', '12:37–50',
  '13:1–20', '13:21–38',
  '14:1–14', '14:15–31',
  '15:1–17', '15:18–16:4',
  '16:5–15', '16:16–33',
  '17:1–26',
  '18:1–14', '18:15–27', '18:28–40',
  '19:1–16', '19:17–30', '19:31–42',
  '20:1–18', '20:19–31',
  '21:1–14', '21:15–25',
])

/** Planos disponíveis por padrão (na primeira execução). */
export function defaultPlans(): ReadingPlan[] {
  return [
    {
      kind: 'readings',
      id: 'evangelho-de-joao',
      name: 'Evangelho de João',
      book: 'João',
      readings: JOHN_READINGS,
      startDate: todayISO(),
      active: true,
    },
  ]
}
