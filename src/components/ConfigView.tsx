import { useEffect, useState } from 'react'
import type { AppState, Weekday } from '../types'
import { ALL_WEEKDAYS, planTotalUnits, weekdayLabel } from '../schedule'

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

/** Converte ISO "yyyy-mm-dd" para "dd/mm/yyyy". */
function isoToBR(iso: string): string {
  const [y, m, d] = iso.split('-')
  return y && m && d ? `${d}/${m}/${y}` : ''
}

/** Converte "dd/mm/yyyy" para ISO "yyyy-mm-dd", ou null se inválido. */
function brToISO(text: string): string | null {
  const match = text.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return null
  const [, dd, mm, yyyy] = match
  const day = Number(dd)
  const month = Number(mm)
  const year = Number(yyyy)
  const date = new Date(year, month - 1, day)
  // Rejeita datas inexistentes (ex: 31/02).
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }
  return `${yyyy}-${mm}-${dd}`
}

/**
 * Campo de data em formato brasileiro (dd/mm/aaaa) por texto, com um
 * seletor de calendário nativo ao lado. Guarda/emite sempre em ISO.
 */
function DateField({
  value,
  onChange,
}: {
  value: string
  onChange: (iso: string) => void
}) {
  const [text, setText] = useState(isoToBR(value))

  useEffect(() => {
    setText(isoToBR(value))
  }, [value])

  return (
    <div className="date-field">
      <input
        type="text"
        inputMode="numeric"
        placeholder="dd/mm/aaaa"
        maxLength={10}
        value={text}
        onChange={(e) => {
          const raw = e.target.value
          setText(raw)
          const iso = brToISO(raw)
          if (iso) onChange(iso)
        }}
        onBlur={() => setText(isoToBR(value))}
      />
      <input
        type="date"
        className="date-picker"
        value={value}
        onChange={(e) => {
          if (e.target.value) onChange(e.target.value)
        }}
        aria-label="Escolher data no calendário"
      />
    </div>
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
          Os dias marcados são ignorados no cronograma — nenhuma leitura é
          agendada neles.
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
            const total = planTotalUnits(plan)
            const readCount = Object.keys(state.progress[plan.id] ?? {}).length
            const unitWord = plan.kind === 'readings' ? 'leituras' : 'capítulos'
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
                    {readCount} / {total} {unitWord} lidas
                  </p>
                </div>

                <div className="plan-config-controls">
                  {plan.kind === 'chapters' && (
                    <label className="field">
                      <span>Capítulos por dia</span>
                      <ChaptersPerDayInput
                        value={plan.chaptersPerDay}
                        max={plan.totalChapters}
                        onCommit={(n) => onSetChaptersPerDay(plan.id, n)}
                      />
                    </label>
                  )}
                  <label className="field">
                    <span>Início</span>
                    <DateField
                      value={plan.startDate}
                      onChange={(iso) => onSetStartDate(plan.id, iso)}
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
