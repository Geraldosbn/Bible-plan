import { useCallback, useEffect, useState } from 'react'
import type { AppState, Settings, Weekday } from './types'
import { loadState, saveState } from './storage'
import { todayISO } from './data/plans'

export interface AppStateApi {
  state: AppState
  /** Marca/desmarca um capítulo como lido no plano informado. */
  toggleChapter: (planId: string, chapter: number) => void
  /** Ativa/desativa um dia da semana na lista de dias pulados. */
  toggleSkipWeekday: (day: Weekday) => void
  /** Define qual plano está ativo (desativa os demais). */
  setActivePlan: (planId: string) => void
  /** Atualiza a data de início de um plano. */
  setStartDate: (planId: string, startDate: string) => void
  /** Limpa todo o progresso de leitura do plano. */
  resetProgress: (planId: string) => void
}

export function useAppState(): AppStateApi {
  const [state, setState] = useState<AppState>(() => loadState())

  useEffect(() => {
    saveState(state)
  }, [state])

  const toggleChapter = useCallback((planId: string, chapter: number) => {
    setState((prev) => {
      const planProgress = { ...(prev.progress[planId] ?? {}) }
      if (planProgress[chapter]) {
        delete planProgress[chapter]
      } else {
        planProgress[chapter] = todayISO()
      }
      return {
        ...prev,
        progress: { ...prev.progress, [planId]: planProgress },
      }
    })
  }, [])

  const toggleSkipWeekday = useCallback((day: Weekday) => {
    setState((prev) => {
      const has = prev.settings.skipWeekdays.includes(day)
      const skipWeekdays = has
        ? prev.settings.skipWeekdays.filter((d) => d !== day)
        : [...prev.settings.skipWeekdays, day].sort((a, b) => a - b)
      const settings: Settings = { ...prev.settings, skipWeekdays }
      return { ...prev, settings }
    })
  }, [])

  const setActivePlan = useCallback((planId: string) => {
    setState((prev) => ({
      ...prev,
      plans: prev.plans.map((p) => ({ ...p, active: p.id === planId })),
    }))
  }, [])

  const setStartDate = useCallback((planId: string, startDate: string) => {
    setState((prev) => ({
      ...prev,
      plans: prev.plans.map((p) =>
        p.id === planId ? { ...p, startDate } : p,
      ),
    }))
  }, [])

  const resetProgress = useCallback((planId: string) => {
    setState((prev) => ({
      ...prev,
      progress: { ...prev.progress, [planId]: {} },
    }))
  }, [])

  return {
    state,
    toggleChapter,
    toggleSkipWeekday,
    setActivePlan,
    setStartDate,
    resetProgress,
  }
}
