import { useEffect, useState } from 'react'
import type { AppState, Weekday } from '../types'
import { ALL_WEEKDAYS, weekdayLabel } from '../schedule'

/**
 * Input numérico que permite ficar vazio durante a digitação.
 * Só consolida um valor válido (>= 1) no onChange; ao sair do campo,
 * um valor vazio/inválido volta para 1 e é limitado ao máximo.
 */
function ChaptersPerDayInput({
  value,
  max,
  onCommit,
}: {
  value: number
  max: number
  onCommit: (value: number) => void
}) {
  const [text, setText] = useState(String(value))

  // Mantém o campo em sincronia quando o valor muda por fora.
  useEffect(() => {
    setText(String(value))
  }, [value])

  return (
    <input
      type="number"
      min={1}
      max={max}
      value={text}
      onChange={(e) => {
        const raw = e.target.value
        setText(raw)
        const n = Number(raw)
        if (raw !== '' && Number.isInteger(n) && n >= 1) {
          onCommit(n)
        }
      }}
      onBlur={() => {
        const n = Math.min(max, Math.max(1, Math.floor(Number(text) || 1)))
        onCommit(n)
        setText(String(n))
      }}
    />
  )
}

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
                    <ChaptersPerDayInput
                      value={plan.chaptersPerDay}
                      max={plan.totalChapters}
                      onCommit={(n) => onSetChaptersPerDay(plan.id, n)}
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
