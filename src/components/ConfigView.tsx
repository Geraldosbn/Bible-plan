import type { AppState, Weekday } from '../types'
import { ALL_WEEKDAYS, weekdayLabel } from '../schedule'

interface Props {
  state: AppState
  onToggleSkipWeekday: (day: Weekday) => void
  onSetActivePlan: (planId: string) => void
  onSetStartDate: (planId: string, startDate: string) => void
  onSetChaptersPerDay: (planId: string, chaptersPerDay: number) => void
  onResetProgress: (planId: string) => void
}

export function ConfigView({
  state,
  onToggleSkipWeekday,
  onSetActivePlan,
  onSetStartDate,
  onSetChaptersPerDay,
  onResetProgress,
}: Props) {
  const { skipWeekdays } = state.settings

  return (
    <section className="config">
      <div className="card">
        <h3>Dias da semana para pular</h3>
        <p className="muted">
          Os dias marcados são ignorados no cronograma — nenhum capítulo é
          agendado neles.
        </p>
        <div className="weekday-grid">
          {ALL_WEEKDAYS.map((day) => {
            const skipped = skipWeekdays.includes(day)
            return (
              <button
                key={day}
                type="button"
                className={`weekday-btn ${skipped ? 'skipped' : ''}`}
                aria-pressed={skipped}
                onClick={() => onToggleSkipWeekday(day)}
              >
                {weekdayLabel(day)}
              </button>
            )
          })}
        </div>
        {skipWeekdays.length >= 7 && (
          <p className="warning">
            Você pulou todos os dias — o plano não tem nenhum dia válido.
          </p>
        )}
      </div>

      <div className="card">
        <h3>Planos</h3>
        <p className="muted">Apenas um plano fica ativo por vez.</p>
        <ul className="plan-config-list">
          {state.plans.map((plan) => {
            const readCount = Object.keys(state.progress[plan.id] ?? {}).length
            return (
              <li key={plan.id} className="plan-config-item">
                <div className="plan-config-main">
                  <label className="active-toggle">
                    <input
                      type="radio"
                      name="active-plan"
                      checked={plan.active}
                      onChange={() => onSetActivePlan(plan.id)}
                    />
                    <span>
                      <strong>{plan.name}</strong>
                      {plan.active && (
                        <span className="badge badge-active">Ativo</span>
                      )}
                    </span>
                  </label>
                  <p className="muted small">
                    {readCount} / {plan.totalChapters} capítulos lidos
                  </p>
                </div>

                <div className="plan-config-controls">
                  <label className="field">
                    <span>Capítulos por dia</span>
                    <input
                      type="number"
                      min={1}
                      max={plan.totalChapters}
                      value={plan.chaptersPerDay}
                      onChange={(e) =>
                        onSetChaptersPerDay(plan.id, e.target.valueAsNumber)
                      }
                    />
                  </label>
                  <label className="field">
                    <span>Início</span>
                    <input
                      type="date"
                      value={plan.startDate}
                      onChange={(e) => onSetStartDate(plan.id, e.target.value)}
                    />
                  </label>
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => {
                      if (
                        confirm(
                          `Apagar todo o progresso de "${plan.name}"? Esta ação não pode ser desfeita.`,
                        )
                      ) {
                        onResetProgress(plan.id)
                      }
                    }}
                  >
                    Zerar progresso
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
