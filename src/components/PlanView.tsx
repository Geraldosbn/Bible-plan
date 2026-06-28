import { useMemo } from 'react'
import type { AppState } from '../types'
import {
  buildSchedule,
  chaptersLabel,
  formatDate,
  isPast,
  isToday,
} from '../schedule'

interface Props {
  state: AppState
  onSetChaptersRead: (planId: string, chapters: number[], read: boolean) => void
}

export function PlanView({ state, onSetChaptersRead }: Props) {
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
          <p className="muted">
            {plan.chaptersPerDay === 1
              ? '1 capítulo por dia'
              : `${plan.chaptersPerDay} capítulos por dia`}
          </p>
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

      <ol className="day-list">
        {schedule.map(({ chapters, date }, index) => {
          const readCountDay = chapters.filter((c) => planProgress[c]).length
          const allRead = readCountDay === chapters.length
          const someRead = readCountDay > 0 && !allRead
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
                  onChange={() =>
                    onSetChaptersRead(plan.id, chapters, !allRead)
                  }
                />
                <span className="day-chapter">
                  {chaptersLabel(plan.book, chapters)}
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
      </ol>
    </section>
  )
}
