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
 * Versão base da Bíblia deste projeto: Almeida Revista e Atualizada (ARA).
 * As divisões dos cronogramas seguem as seções (perícopes) dessa versão.
 */
export const BASE_VERSION = 'ARA'

/**
 * Cronograma do Evangelho de João, por seções da ARA.
 * 84 leituras por passagens, sem tema.
 */
export const JOHN_GOSPEL_READINGS: Reading[] = readingsOf('João', [
  '1:1–14', '1:15–18', '1:19–28', '1:29–31', '1:32–34', '1:35–42', '1:43–51',
  '2:1–12', '2:13–22', '2:23–25',
  '3:1–15', '3:16–21', '3:22–30', '3:31–36',
  '4:1–18', '4:19–30', '4:31–38', '4:39–42', '4:43–45', '4:46–54',
  '5:1–18', '5:19–47',
  '6:1–15', '6:16–21', '6:22–40', '6:41–59', '6:60–65', '6:66–71',
  '7:1–9', '7:10–13', '7:14–24', '7:25–36', '7:37–44', '7:45–53',
  '8:1–11', '8:12–20', '8:21–59',
  '9:1–12', '9:13–34', '9:35–41',
  '10:1–18', '10:19–21', '10:22–42',
  '11:1–46', '11:47–57',
  '12:1–8', '12:9–11', '12:12–19', '12:20–36', '12:37–43', '12:44–50',
  '13:1–11', '13:12–20', '13:21–30', '13:31–35', '13:36–38',
  '14:1–15', '14:16–31',
  '15:1–27',
  '16:1–24', '16:25–33',
  '17:1–26',
  '18:1–11', '18:12–14', '18:15–18', '18:19–24', '18:25–27', '18:28–32', '18:33–40',
  '19:1–16', '19:17–22', '19:23–27', '19:28–30', '19:31–37', '19:38–42',
  '20:1–10', '20:11–18', '20:19–23', '20:24–25', '20:26–29', '20:30–31',
  '21:1–14', '21:15–23', '21:24–25',
])

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

export function gospelPlan(active: boolean): ReadingPlan {
  return {
    kind: 'readings',
    id: 'evangelho-de-joao',
    name: 'Evangelho de João',
    book: 'João',
    readings: JOHN_GOSPEL_READINGS,
    startDate: todayISO(),
    active,
  }
}

export function lettersPlan(active: boolean): ReadingPlan {
  return {
    kind: 'readings',
    id: 'cartas-de-joao',
    name: '1, 2 e 3 João',
    book: '1, 2 e 3 João',
    readings: JOHN_LETTERS_READINGS,
    startDate: todayISO(),
    active,
  }
}

/** Planos disponíveis por padrão (na primeira execução). */
export function defaultPlans(): ReadingPlan[] {
  return [gospelPlan(true), lettersPlan(false)]
}
