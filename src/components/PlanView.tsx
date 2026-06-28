import { useMemo } from 'react'
import type { AppState } from '../types'
import {
  buildSchedule,
  formatDate,
  isPast,
  isToday,
} from '../schedule'

interface Props {
  state: AppState
  onToggleChapter: (planId: string, chapter: number) => void
}

export function PlanView({ state, onToggleChapter }: Props) {
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
  const readCount = Object.keys(planProgress).length
  const percent = Math.round((readCount / plan.totalChapters) * 100)

  return (
    <section>
      <div className="plan-header">
        <div>
          <h2>{plan.book}</h2>
          <p className="muted">{plan.name}</p>
        </div>
        <span className="badge badge-active">Ativo</span>
      </div>

      <div className="progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
        <span className="progress-label">
          {readCount} / {plan.totalChapters} capítulos ({percent}%)
        </span>
      </div>

      <ul className="day-list">
        {schedule.map(({ chapter, date }) => {
          const read = Boolean(planProgress[chapter])
          const today = isToday(date)
          const overdue = !read && isPast(date)
          const classes = [
            'day-item',
            read && 'day-read',
            today && 'day-today',
            overdue && 'day-overdue',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <li key={chapter} className={classes}>
              <label>
                <input
                  type="checkbox"
                  checked={read}
                  onChange={() => onToggleChapter(plan.id, chapter)}
                />
                <span className="day-chapter">
                  {plan.book} {chapter}
                </span>
                <span className="day-date">
                  {formatDate(date)}
                  {today && <span className="tag tag-today">hoje</span>}
                  {overdue && <span className="tag tag-overdue">atrasado</span>}
                </span>
              </label>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
