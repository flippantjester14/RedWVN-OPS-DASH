import Header from './components/Header'
import AlertBanner from './components/AlertBanner'
import MetricCard from './components/MetricCard'
import LiveMap from './components/LiveMap'
import Terminal from './components/Terminal'
import NodeMonitor from './components/NodeMonitor'
import MissionReplay from './components/MissionReplay'
import { useDataFetch } from './hooks/useDataFetch'
import './App.css'

export default function App() {
  const csvUrl = null
  const { metrics, alert, isSimulating } = useDataFetch(csvUrl, 60000)

  return (
    <div className="app-container">
      <Header />

      <main className="main-grid">
        <section className="alert-section">
          {alert.active && <AlertBanner message={alert.message} type={alert.type} />}
        </section>

        <section className="metrics-section">
          <MetricCard
            label="Mission Success"
            title="Flight Completion"
            value={`${metrics.flightCompletion.toFixed(2)}%`}
            trend={8}
            type="success"
            delay={0.1}
          />
          <MetricCard
            label="On-Time Performance"
            title="OTP"
            value={`${metrics.otp.toFixed(2)}%`}
            type="warning"
            delay={0.15}
          />
          <MetricCard
            label="Cumulative Distance"
            title="Theater Range"
            value={`${metrics.theaterRange} km`}
            delay={0.2}
          />
          <MetricCard
            label="Active Assets"
            title="Drones Airborne"
            value={`${metrics.activeAssets} Drones`}
            type="live"
            delay={0.25}
            showBars={true}
          />
        </section>

        <aside className="left-panel">
          <NodeMonitor />
        </aside>

        <section className="center-panel">
          <LiveMap />
        </section>

        <aside className="right-panel">
          <Terminal />
        </aside>

        <section className="replay-section">
          <MissionReplay />
        </section>

        {isSimulating && (
          <div className="sim-badge">
            <div className="sim-dot pulse"></div>
            <span>SIMULATION</span>
          </div>
        )}
      </main>
    </div>
  )
}
