import type { AppState, ReadingPlan } from './types'
import { defaultPlans, gospelPlan, todayISO } from './data/plans'

const GOSPEL_ID = 'evangelho-de-joao'

// v7: Evangelho de João com 82 leituras (seções da ARA) como plano ativo.
const STORAGE_KEY = 'bible-plan:v7'
// Versões anteriores — migradas preservando configurações e outros planos.
const LEGACY_KEYS = ['bible-plan:v6', 'bible-plan:v5']

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

    // Migração v5/v6 -> v7: troca o Evangelho de João pelo novo cronograma.
    // O progresso do plano antigo é descartado: os índices das leituras mudam.
    const legacy = LEGACY_KEYS.map((k) => localStorage.getItem(k)).find(Boolean)
    if (legacy) {
      const old = mergeState(JSON.parse(legacy) as Partial<AppState>, base, false)
      const previous = old.plans.find((p) => p.id === GOSPEL_ID)
      const progress = { ...old.progress }
      delete progress[GOSPEL_ID]
      return {
        ...old,
        plans: [
          { ...gospelPlan(true), startDate: previous?.startDate ?? todayISO() },
          ...old.plans.filter((p) => p.id !== GOSPEL_ID).map((p) => ({ ...p, active: false })),
        ],
        progress,
      }
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
