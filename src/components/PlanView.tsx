import { useMemo } from 'react'
import type { AppState } from '../types'
import {
  buildSchedule,
  formatDate,
  isPast,
  isToday,
  planTotalUnits,
} from '../schedule'

interface Props {
  state: AppState
  onSetUnitsRead: (planId: string, units: string[], read: boolean) => void
}

export function PlanView({ state, onSetUnitsRead }: Props) {
  const plan = state.plans.find((p) => p.active)

  const schedule = useMemo(
    () => (plan ? buildSchedule(plan, state.settings.skipWeekdays) : []),
    [plan, state.settings.skipWeekdays],
  )

  if (!plan) {
    return (
      <div className="empty">
        Nenhum plano ativo. Vá em <strong>Config</strong> e ative um plano.
      </div>
    )
  }

  if (schedule.length === 0) {
    return (
      <div className="empty">
        Todos os dias da semana estão sendo pulados. Ajuste em{' '}
        <strong>Config</strong>.
      </div>
    )
  }

  const planProgress = state.progress[plan.id] ?? {}
  const total = planTotalUnits(plan)
  const readCount = Object.keys(planProgress).length
  const percent = total > 0 ? Math.round((readCount / total) * 100) : 0

  const subtitle =
    plan.kind === 'readings'
      ? `${plan.readings.length} leituras`
      : plan.chaptersPerDay === 1
        ? '1 capítulo por dia'
        : `${plan.chaptersPerDay} capítulos por dia`

  return (
    <section>
      <div className="plan-header">
        <div>
          <h2>{plan.book}</h2>
          <p className="muted">{subtitle}</p>
        </div>
        <span className="badge badge-active">Ativo</span>
      </div>

      <div className="progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
        <span className="progress-label">
          {readCount} / {total} leituras ({percent}%)
        </span>
      </div>

      <ol className="day-list">
        {schedule.map(({ label, theme, units, date }, index) => {
          const readUnits = units.filter((u) => planProgress[u]).length
          const allRead = readUnits === units.length
          const someRead = readUnits > 0 && !allRead
          const today = isToday(date)
          const overdue = !allRead && isPast(date)
          const classes = [
            'day-item',
            allRead && 'day-read',
            today && 'day-today',
            overdue && 'day-overdue',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <li key={index} className={classes}>
              <label>
                <input
                  type="checkbox"
                  checked={allRead}
                  ref={(el) => {
                    if (el) el.indeterminate = someRead
                  }}
                  onChange={() => onSetUnitsRead(plan.id, units, !allRead)}
                />
                <div className="day-body">
                  <span className="day-chapter">{label}</span>
                  {theme && <span className="day-theme">{theme}</span>}
                </div>
                <span className="day-date">
                  {formatDate(date)}
                  {today && <span className="tag tag-today">hoje</span>}
                  {overdue && <span className="tag tag-overdue">atrasado</span>}
                </span>
              </label>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
