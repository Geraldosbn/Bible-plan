import type { AppState } from './types'
import { defaultPlans } from './data/plans'

const STORAGE_KEY = 'bible-plan:v1'

export function defaultState(): AppState {
  return {
    plans: defaultPlans(),
    settings: { skipWeekdays: [] },
    progress: {},
  }
}

/** Lê o estado do localStorage, mesclando com os defaults para resistir a versões antigas. */
export function loadState(): AppState {
  const base = defaultState()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return base

    const parsed = JSON.parse(raw) as Partial<AppState>
    return {
      plans: parsed.plans?.length ? parsed.plans : base.plans,
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
