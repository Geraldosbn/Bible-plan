import { useCallback, useEffect, useState } from 'react'
import type { AppState, Settings, Weekday } from './types'
import { loadState, saveState } from './storage'
import { todayISO } from './data/plans'

export interface AppStateApi {
  state: AppState
  /** Define o estado de leitura de um conjunto de unidades (um dia inteiro). */
  setUnitsRead: (planId: string, units: string[], read: boolean) => void
  /** Define quantos capítulos são lidos por dia em um plano por capítulos. */
  setChaptersPerDay: (planId: string, chaptersPerDay: number) => void
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

  const setUnitsRead = useCallback(
    (planId: string, units: string[], read: boolean) => {
      setState((prev) => {
        const planProgress = { ...(prev.progress[planId] ?? {}) }
        if (read) {
          const stamp = todayISO()
          for (const u of units) {
            if (!planProgress[u]) planProgress[u] = stamp
          }
        } else {
          for (const u of units) delete planProgress[u]
        }
        return {
          ...prev,
          progress: { ...prev.progress, [planId]: planProgress },
        }
      })
    },
    [],
  )

  const setChaptersPerDay = useCallback(
    (planId: string, chaptersPerDay: number) => {
      const value = Math.max(1, Math.floor(chaptersPerDay) || 1)
      setState((prev) => ({
        ...prev,
        plans: prev.plans.map((p) =>
          p.id === planId && p.kind === 'chapters'
            ? { ...p, chaptersPerDay: value }
            : p,
        ),
      }))
    },
    [],
  )

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
    setUnitsRead,
    setChaptersPerDay,
    toggleSkipWeekday,
    setActivePlan,
    setStartDate,
    resetProgress,
  }
}
