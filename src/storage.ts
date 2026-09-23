import type { AppState, ReadingPlan } from './types'
import { defaultPlans } from './data/plans'

// v5: passa a pular sábado e domingo por padrão.
const STORAGE_KEY = 'bible-plan:v5'
// Versão anterior — migrada preservando planos e progresso.
const LEGACY_KEY = 'bible-plan:v4'

export function defaultState(): AppState {
  return {
    plans: defaultPlans(),
    // 0 = domingo, 6 = sábado: fim de semana pulado por padrão.
    settings: { skipWeekdays: [0, 6] },
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

/**
 * Mescla o estado carregado com os defaults.
 * `useDefaultSettings` força o padrão de configurações (usado na migração
 * de versões antigas, para aplicar o novo default de dias pulados).
 */
function mergeState(
  parsed: Partial<AppState>,
  base: AppState,
  useDefaultSettings: boolean,
): AppState {
  return {
    plans: parsed.plans?.length ? parsed.plans.map(normalizePlan) : base.plans,
    settings: useDefaultSettings
      ? base.settings
      : {
          skipWeekdays:
            parsed.settings?.skipWeekdays ?? base.settings.skipWeekdays,
        },
    progress: parsed.progress ?? base.progress,
  }
}

/** Lê o estado do localStorage, migrando da versão anterior quando preciso. */
export function loadState(): AppState {
  const base = defaultState()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return mergeState(JSON.parse(raw) as Partial<AppState>, base, false)

    // Migração v4 -> v5: preserva planos/progresso e aplica o novo default.
    const legacy = localStorage.getItem(LEGACY_KEY)
    if (legacy) {
      return mergeState(JSON.parse(legacy) as Partial<AppState>, base, true)
    }
  } catch {
    // JSON corrompido ou localStorage indisponível: começa do zero.
    return base
  }
  return base
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Sem espaço ou modo privativo: ignora silenciosamente.
  }
}
