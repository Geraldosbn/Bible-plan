import { useState } from 'react'
import { useAppState } from './useAppState'
import { PlanView } from './components/PlanView'
import { ConfigView } from './components/ConfigView'
import './App.css'

type Tab = 'plano' | 'config'

export default function App() {
  const [tab, setTab] = useState<Tab>('plano')
  const {
    state,
    setChaptersRead,
    setChaptersPerDay,
    toggleSkipWeekday,
    setActivePlan,
    setStartDate,
    resetProgress,
  } = useAppState()

  return (
    <div className="app">
      <header className="app-header">
        <h1>📖 Plano de Leitura Bíblica</h1>
        <nav className="tabs">
          <button
            className={tab === 'plano' ? 'tab active' : 'tab'}
            onClick={() => setTab('plano')}
          >
            Plano
          </button>
          <button
            className={tab === 'config' ? 'tab active' : 'tab'}
            onClick={() => setTab('config')}
          >
            Config
          </button>
        </nav>
      </header>

      <main className="app-main">
        {tab === 'plano' ? (
          <PlanView state={state} onSetChaptersRead={setChaptersRead} />
        ) : (
          <ConfigView
            state={state}
            onToggleSkipWeekday={toggleSkipWeekday}
            onSetActivePlan={setActivePlan}
            onSetStartDate={setStartDate}
            onSetChaptersPerDay={setChaptersPerDay}
            onResetProgress={resetProgress}
          />
        )}
      </main>

      <footer className="app-footer">
        Seu progresso fica salvo neste navegador (localStorage).
      </footer>
    </div>
  )
}
