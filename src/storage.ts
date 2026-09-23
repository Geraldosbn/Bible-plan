import type { AppState, ReadingPlan } from './types'
import { defaultPlans } from './data/plans'

// v4: plano passou para as cartas de João (1, 2 e 3 João) combinadas.
const STORAGE_KEY = 'bible-plan:v4'

export function defaultState(): AppState {
  return {
    plans: defaultPlans(),
    settings: { skipWeekdays: [] },
    progress: {},
  }
}

/** Garante campos coerentes por tipo de plano em dados carregados. */
function normalizePlan(plan: ReadingPlan): ReadingPlan {
  if (plan.kind === 'chapters') {
    return {
      ...plan,
      chaptersPerDay: Math.max(1, Math.floor(plan.chaptersPerDay) || 1),
    }
  }
  return plan
}

/** Lê o estado do localStorage, mesclando com os defaults para resistir a versões antigas. */
export function loadState(): AppState {
  const base = defaultState()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return base

    const parsed = JSON.parse(raw) as Partial<AppState>
    return {
      plans: parsed.plans?.length
        ? parsed.plans.map(normalizePlan)
        : base.plans,
      settings: {
        skipWeekdays: parsed.settings?.skipWeekdays ?? base.settings.skipWeekdays,
      },
      progress: parsed.progress ?? base.progress,
    }
  } catch {
    // JSON corrompido ou localStorage indisponível: começa do zero.
    return base
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Sem espaço ou modo privativo: ignora silenciosamente.
  }
}
