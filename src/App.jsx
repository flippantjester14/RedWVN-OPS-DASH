import { useState, useEffect, useMemo, useCallback, Component } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchFlightData, computeMetrics, getRouteStats, getPilotStats, getUAVStats, getDailyStats, getNodeStats, filterFlightsByPeriod, getMedicalOpsStats } from './data/flights'
import { fetchLiveDrones, getStatusInfo, getCacheStatus } from './data/droneTracking'
import FleetMap from './components/FleetMap'
import logo from './assets/redwing_logo.png'
import './App.css'

function ts() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })
}

/* ─── Error Boundary ─── */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false })
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-3)' }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>No data available for this period</div>
          <div style={{ fontSize: 12 }}>Try switching to "All Time" to see all flight data.</div>
        </div>
      )
    }
    return this.props.children
  }
}

/* ─── Splash ─── */
function Splash({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2000); return () => clearTimeout(t) }, [onDone])
  return (
    <motion.div className="splash-screen"
      initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <motion.div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}>

        <motion.img
          src={logo}
          alt="Redwing Labs"
          style={{ height: 80, marginBottom: 16 }}
          initial={{ filter: 'brightness(0) invert(1)', opacity: 0 }}
          animate={{ filter: 'brightness(0) invert(1)', opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        />

        <div style={{ width: 120, height: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden', marginTop: 12 }}>
          <motion.div
            style={{ height: '100%', background: '#FF2080', borderRadius: 2 }}
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        </div>

        <motion.div
          style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 3, marginTop: 12, fontWeight: 600, textTransform: 'uppercase' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Systems Initializing
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Mini bar chart ─── */
function BarChart({ data, maxVal, color = 'var(--pink)', height = 80 }) {
  if (!data || data.length === 0) return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', fontSize: 12 }}>No data</div>
  const max = maxVal || Math.max(...data.map(d => d.value), 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <motion.div
            initial={{ height: 0 }} animate={{ height: `${(d.value / max) * 100}%` }}
            transition={{ duration: 0.6, delay: i * 0.05 }}
            style={{ width: '100%', background: color, borderRadius: '2px 2px 0 0', minHeight: d.value > 0 ? 2 : 0 }}
            title={`${d.label}: ${d.value}`}
          />
          <span style={{ fontSize: 8, color: 'var(--text-3)', fontWeight: 600, whiteSpace: 'nowrap' }}>{d.label}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── Progress ring ─── */
function Ring({ value, max, size = 48, color = 'var(--pink)' }) {
  const pct = Math.min(value / (max || 1), 1)
  const r = (size - 6) / 2
  const circ = 2 * Math.PI * r
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={3} />
      <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={3}
        strokeLinecap="round" strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ * (1 - pct) }}
        transition={{ duration: 1, ease: 'easeOut' }} />
    </svg>
  )
}

/* ─── No Data Message ─── */
function NoData({ period }) {
  return (
    <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-3)' }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>No flights for {period === 'daily' ? 'today' : 'this week'}</div>
      <div style={{ fontSize: 12 }}>Flight data will appear here when flights are logged for this period.</div>
    </div>
  )
}

/* ─── App ─── */
export default function App() {
  const [ready, setReady] = useState(false)
  const [tab, setTab] = useState('overview')
  const [flights, setFlights] = useState([])
  const [period, setPeriod] = useState('all') // 'daily', 'weekly', 'all'
  const [lastUpdated, setLastUpdated] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [liveDrones, setLiveDrones] = useState([])
  const [droneStatus, setDroneStatus] = useState({ isStale: false, isCached: false, age: 0 })

  const [clock, setClock] = useState(ts())
  useEffect(() => { const t = setInterval(() => setClock(ts()), 1000); return () => clearInterval(t) }, [])

  // Fetch flight log data
  useEffect(() => {
    const load = async () => {
      const data = await fetchFlightData()
      setFlights(data)
      setLastUpdated(new Date().toLocaleTimeString())
    }
    load()
    const poll = setInterval(load, 30000)
    return () => clearInterval(poll)
  }, [])

  // Fetch live drone tracking data (with resilient retry + caching)
  useEffect(() => {
    const loadDrones = async () => {
      const data = await fetchLiveDrones()
      if (data.length > 0) setLiveDrones(data)
      setDroneStatus(getCacheStatus())
    }
    loadDrones()
    const poll = setInterval(loadDrones, 5000)
    return () => clearInterval(poll)
  }, [])

  // Computed metrics
  const displayFlights = useMemo(() => filterFlightsByPeriod(flights, period), [flights, period])
  const m = useMemo(() => computeMetrics(displayFlights), [displayFlights])

  const routes = useMemo(() => getRouteStats(displayFlights), [displayFlights])
  const pilots = useMemo(() => getPilotStats(displayFlights), [displayFlights])
  const uavs = useMemo(() => getUAVStats(displayFlights), [displayFlights])
  const daily = useMemo(() => getDailyStats(displayFlights), [displayFlights])
  const nodes = useMemo(() => getNodeStats(displayFlights), [displayFlights])
  const medOps = useMemo(() => getMedicalOpsStats(displayFlights), [displayFlights])

  const allTimeDaily = useMemo(() => getDailyStats(flights), [flights])

  const hours = Math.floor(m.totalMinutes / 60)
  const mins = m.totalMinutes % 60

  // Precland & LFAO stats
  const preclandOn = displayFlights.filter(f => f.precland === 'On Marker').length
  const preclandOff = displayFlights.filter(f => f.precland === 'Off Marker').length
  const preclandTotal = preclandOn + preclandOff
  const lfaoWorked = displayFlights.filter(f => f.lfao === 'Worked').length
  const lfaoPartial = displayFlights.filter(f => f.lfao && f.lfao.includes('Partial')).length
  const lfaoDisable = displayFlights.filter(f => f.lfao === 'Disable').length
  const lfaoTotal = lfaoWorked + lfaoPartial + lfaoDisable


  const hasData = displayFlights.length > 0
  const handleSplashDone = useCallback(() => setReady(true), []) // Fix: Stability for Splash effect

  return (
    <div className="app">
      <AnimatePresence>
        {!ready && <Splash key="s" onDone={handleSplashDone} />}
      </AnimatePresence>

      {ready && <>
        <header className="header">
          <div className="header-main">
            <div className="logo">
              <img src={logo} alt="Redwing" style={{ height: 32, filter: 'brightness(0) invert(1)' }} />
              <div className="logo-divider" />
              <span className="logo-sub">Operations</span>
            </div>
            <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>

          <nav className={`nav-tabs ${menuOpen ? 'mobile-open' : ''}`}>
            {['overview', 'medical', 'analytics', 'fleet', 'flights'].map(t => (
              <button key={t} className={`nav-tab ${tab === t ? 'active' : ''}`} onClick={() => { setTab(t); setMenuOpen(false); }}>{t}</button>
            ))}
          </nav>

          <div className="header-right">
            <div className="period-toggle">
              {['daily', 'weekly', 'all'].map(p => (
                <button
                  key={p}
                  className={`period-btn ${period === p ? 'active' : ''}`}
                  onClick={() => { console.log('Period changed to:', p); setPeriod(p) }}
                >
                  {p === 'all' ? 'All Time' : p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
            <div className="status-group">
              <button className="refresh-btn" onClick={() => window.location.reload()} title="Refresh Data">
                ↻
              </button>
              <span className="header-time">{clock} IST</span>
              <div className={`live-pill ${!flights.length ? 'loading' : ''}`}>
                <span className="pulse-dot" /> {flights.length ? 'LIVE SYNC' : 'CONNECTING...'}
              </div>
            </div>
          </div>
        </header>

        <div className="content">
          <AnimatePresence mode="wait">

            {/* ═══ OVERVIEW ═══ */}
            {tab === 'overview' && (
              <motion.div key="ov" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>

                <div className="hero-banner">
                  <div>
                    <div className="hero-label">Andhra Pradesh · Paderu—Araku Corridor</div>
                    <div className="hero-title">Flight Operations Dashboard</div>
                    <div className="hero-sub">{m.totalFlights} flights · {m.liveCount} live deliveries · {m.pilotCount} pilots · {m.locationCount} nodes</div>
                  </div>
                </div>

                {/* KPI row */}
                <div className="stats-row">
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'var(--pink-light)', color: 'var(--pink)' }}>✈</div>
                    <div className="stat-label">Total Flights</div>
                    <div className="stat-value">{m.totalFlights}</div>
                    <div className="stat-footer"><span className="up">{m.liveCount}</span> live · {m.testCount} test</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(61,90,254,0.08)', color: 'var(--blue)' }}>📍</div>
                    <div className="stat-label">Distance Flown</div>
                    <div className="stat-value">{m.totalDistance.toLocaleString()}<span className="stat-unit">km</span></div>
                    <div className="stat-footer">Aerial kilometers</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'var(--green-light)', color: 'var(--green)' }}>⏱</div>
                    <div className="stat-label">Flight Time</div>
                    <div className="stat-value">{hours}h {mins}m</div>
                    <div className="stat-footer">{m.totalMinutes} minutes total</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'var(--amber-light)', color: 'var(--amber)' }}>📦</div>
                    <div className="stat-label">Payload Moved</div>
                    <div className="stat-value">{m.totalPayloadKg}<span className="stat-unit">kg</span></div>
                    <div className="stat-footer">across the network</div>
                  </div>
                </div>

                {!hasData && <NoData period={period} />}

                {hasData && <>
                  {/* Daily activity chart + Route table */}
                  <div className="responsive-grid-2">
                    <div className="panel">
                      <div className="panel-head">
                        <span className="panel-title">Daily Flight Activity</span>
                        <span className="panel-green">{daily.length} DAYS</span>
                      </div>
                      <div className="panel-body" style={{ padding: 16 }}>
                        <BarChart
                          data={daily.map(d => ({ label: d.date.slice(0, 5), value: d.flights }))}
                          color="var(--pink)"
                          height={120}
                        />
                        <div style={{ marginTop: 12, display: 'flex', gap: 16, fontSize: 11, color: 'var(--text-3)' }}>
                          {daily.length > 0 && (
                            <span>Most active: <strong style={{ color: 'var(--text)' }}>{daily.reduce((a, b) => b.flights > a.flights ? b : a).date}</strong> ({daily.reduce((a, b) => b.flights > a.flights ? b : a).flights} flights)</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="panel">
                      <div className="panel-head">
                        <span className="panel-title">Top Routes</span>
                        <span className="panel-green">{routes.length} ROUTES</span>
                      </div>
                      <div className="panel-body">
                        <table className="data-table"><thead><tr>
                          <th>Route</th><th>Flights</th><th>Avg Duration</th><th>Total Distance</th>
                        </tr></thead><tbody>
                            {routes.slice(0, 6).map((r, i) => (
                              <tr key={i}>
                                <td style={{ color: 'var(--text)', fontWeight: 600 }}>{r.route}</td>
                                <td className="mono bold">{r.count}</td>
                                <td className="mono">{r.avgDuration} min</td>
                                <td className="mono">{r.totalDist} km</td>
                              </tr>
                            ))}
                          </tbody></table>
                      </div>
                    </div>
                  </div>

                  {/* Pilot leaderboard + Node stats */}
                  <div className="responsive-grid-2">
                    <div className="panel">
                      <div className="panel-head">
                        <span className="panel-title">Pilot Leaderboard</span>
                        <span className="panel-green">{pilots.length} PILOTS</span>
                      </div>
                      <div className="panel-body">
                        {pilots.map((p, i) => (
                          <div key={p.name} style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: i === 0 ? 'var(--pink)' : i === 1 ? 'var(--blue)' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: i < 2 ? 'white' : 'var(--text-3)', flexShrink: 0 }}>{i + 1}</div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 14, fontWeight: 700 }}>{p.name}</div>
                              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
                                {p.flights} flights · {Math.round(p.distance)} km · {p.live} live
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontFamily: 'var(--display)', fontSize: 20, fontWeight: 800 }}>{Math.floor(p.minutes / 60)}h {p.minutes % 60}m</div>
                              <div style={{ fontSize: 10, color: 'var(--text-3)' }}>airtime</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="panel">
                      <div className="panel-head">
                        <span className="panel-title">Node Operations</span>
                        <span className="panel-green">{nodes.length} NODES</span>
                      </div>
                      <div className="panel-body">
                        <table className="data-table"><thead><tr>
                          <th>Location</th><th>Takeoffs</th><th>Landings</th><th>Deliveries</th>
                        </tr></thead><tbody>
                            {nodes.map((n, i) => (
                              <tr key={i}>
                                <td style={{ color: 'var(--text)', fontWeight: 600 }}>{n.name}</td>
                                <td className="mono">{n.takeoffs}</td>
                                <td className="mono">{n.landings}</td>
                                <td className="mono bold">{n.deliveries}</td>
                              </tr>
                            ))}
                          </tbody></table>
                      </div>
                    </div>
                  </div>

                  {/* Recent 8 flights */}
                  <div className="section-header">
                    <h2 className="section-title">Recent Flights</h2>
                    <span className="section-count">{displayFlights.length} total</span>
                  </div>
                  <div className="table-card">
                    <div className="table-wrap">
                      <table className="data-table"><thead><tr>
                        <th>Date</th><th>ID</th><th>UAV</th><th>Type</th><th>Pilot</th><th>Route</th><th>Dist</th><th>Dur</th><th>Payload</th>
                      </tr></thead><tbody>
                          {[...displayFlights].reverse().slice(0, 8).map((f, i) => (
                            <tr key={i}>
                              <td className="mono">{f.date}</td>
                              <td className="mono bold">{f.flightId}</td>
                              <td className="mono">{f.uav}</td>
                              <td><span className={`type-badge ${f.type === 'Live' ? 'live' : 'test'}`}>{f.type}</span></td>
                              <td>{f.pilot}</td>
                              <td style={{ color: 'var(--text)' }}>{f.from} → {f.to}</td>
                              <td className="mono">{f.distance > 0 ? `${f.distance}` : '-'}</td>
                              <td className="mono">{f.duration}</td>
                              <td className="mono">{f.payload > 0 ? `${f.payload}g` : '-'}</td>
                            </tr>
                          ))}
                        </tbody></table>
                    </div>
                  </div>
                </>}
              </motion.div>
            )}

            {/* ═══ MEDICAL OPS ═══ */}
            {tab === 'medical' && (
              <motion.div key="med" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <div className="section-header" style={{ marginTop: 4 }}>
                  <h2 className="section-title">Medical Operations</h2>
                  <span className="section-count">{medOps.totalDeliveries} deliveries</span>
                </div>

                {!hasData || medOps.totalDeliveries === 0 ? (
                  <NoData period={period} />
                ) : (
                  <>
                    <div className="stats-row" style={{ marginBottom: 28 }}>
                      <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(255,32,128,0.08)', color: 'var(--pink)' }}>🏥</div>
                        <div className="stat-label">Medical Deliveries</div>
                        <div className="stat-value">{medOps.totalDeliveries}</div>
                        <div className="stat-footer">order flights completed</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'var(--green-light)', color: 'var(--green)' }}>⚖️</div>
                        <div className="stat-label">Payload Delivered</div>
                        <div className="stat-value">{medOps.totalPayloadKg}<span className="stat-unit">kg</span></div>
                        <div className="stat-footer">{medOps.totalPayloadG}g total</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(61,90,254,0.08)', color: 'var(--blue)' }}>🛤️</div>
                        <div className="stat-label">Delivery Routes</div>
                        <div className="stat-value">{medOps.routes.length}</div>
                        <div className="stat-footer">unique corridors</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'var(--amber-light)', color: 'var(--amber)' }}>📊</div>
                        <div className="stat-label">Avg Payload</div>
                        <div className="stat-value">{medOps.totalDeliveries > 0 ? Math.round(medOps.totalPayloadG / medOps.totalDeliveries) : 0}<span className="stat-unit">g</span></div>
                        <div className="stat-footer">per delivery flight</div>
                      </div>
                    </div>

                    <div className="responsive-grid-2">
                      <div className="panel">
                        <div className="panel-head">
                          <span className="panel-title">Daily Medical Volume</span>
                        </div>
                        <div className="panel-body" style={{ padding: 16 }}>
                          <BarChart
                            data={medOps.daily.map(d => ({ label: d.date.slice(0, 5), value: d.count }))}
                            color="var(--pink)"
                            height={160}
                          />
                        </div>
                      </div>

                      <div className="panel">
                        <div className="panel-head">
                          <span className="panel-title">Delivery Route Breakdown</span>
                        </div>
                        <div className="panel-body">
                          <table className="data-table"><thead><tr>
                            <th>Route</th><th>Deliveries</th><th>Total Payload</th>
                          </tr></thead><tbody>
                              {medOps.routes.map((r, i) => (
                                <tr key={i}>
                                  <td style={{ color: 'var(--text)', fontWeight: 600 }}>{r.route}</td>
                                  <td className="mono bold">{r.count}</td>
                                  <td className="mono">{r.payload}g</td>
                                </tr>
                              ))}
                            </tbody></table>
                        </div>
                      </div>
                    </div>

                    <div className="table-card">
                      <div className="panel-head">
                        <span className="panel-title">Medical Delivery Log</span>
                      </div>
                      <div className="table-wrap">
                        <table className="data-table"><thead><tr>
                          <th>Date</th><th>Order ID</th><th>Flight</th><th>UAV</th><th>Pilot</th><th>Route</th><th>Payload</th><th>Duration</th>
                        </tr></thead><tbody>
                            {[...medOps.deliveries].reverse().map((f, i) => (
                              <tr key={i}>
                                <td className="mono">{f.date}</td>
                                <td className="mono bold" style={{ color: 'var(--pink)' }}>{f.orderId}</td>
                                <td className="mono">{f.flightId}</td>
                                <td className="mono">{f.uav}</td>
                                <td>{f.pilot}</td>
                                <td style={{ color: 'var(--text)' }}>{f.from} → {f.to}</td>
                                <td className="mono bold">{f.payload > 0 ? `${f.payload}g` : '-'}</td>
                                <td className="mono">{f.duration}</td>
                              </tr>
                            ))}
                          </tbody></table>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}



            {/* ═══ ANALYTICS ═══ */}
            {tab === 'analytics' && (
              <motion.div key="an" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>

                <div className="section-header" style={{ marginTop: 4 }}>
                  <h2 className="section-title">System Analytics</h2>
                  <span className="section-count">V 2.0</span>
                </div>

                <ErrorBoundary resetKey={period}>
                  {/* Precland + LFAO */}
                  <div className="responsive-grid-2">
                    <div className="stat-card" style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                      <Ring value={preclandOn} max={preclandTotal} size={64} color="var(--green)" />
                      <div>
                        <div className="stat-label">Precision Landing</div>
                        <div className="stat-value" style={{ fontSize: 28 }}>{preclandTotal > 0 ? Math.round(preclandOn / preclandTotal * 100) : 0}%</div>
                        <div className="stat-footer"><span className="up">{preclandOn}</span> on-marker · {preclandOff} off-marker</div>
                      </div>
                    </div>
                    <div className="stat-card" style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                      <Ring value={lfaoWorked} max={lfaoTotal} size={64} color="var(--blue)" />
                      <div>
                        <div className="stat-label">LFAO Script</div>
                        <div className="stat-value" style={{ fontSize: 28 }}>{lfaoWorked + lfaoPartial}/{lfaoTotal}</div>
                        <div className="stat-footer"><span className="up">{lfaoWorked}</span> worked · {lfaoPartial} partial · {lfaoDisable} disabled</div>
                      </div>
                    </div>
                  </div>

                  {/* Distance by day */}
                  <div className="panel" style={{ marginBottom: 28 }}>
                    <div className="panel-head">
                      <span className="panel-title">Distance Covered Per Day</span>
                      <span className="panel-green">{m.totalDistance} KM TOTAL</span>
                    </div>
                    <div className="panel-body" style={{ padding: 16 }}>
                      <BarChart
                        data={daily.map(d => ({ label: d.date.slice(0, 5), value: Math.round(d.distance) }))}
                        color="var(--blue)"
                        height={128}
                      />
                    </div>
                  </div>

                  {/* Test vs Live per day */}
                  {daily.length > 0 && (
                    <div className="panel" style={{ marginBottom: 28 }}>
                      <div className="panel-head">
                        <span className="panel-title">Test vs Live Flights by Day</span>
                      </div>
                      <div className="panel-body">
                        <table className="data-table"><thead><tr>
                          <th>Date</th><th>Test</th><th>Live</th><th>Total</th><th>Distance</th><th>Ratio</th>
                        </tr></thead><tbody>
                            {daily.map((d, i) => (
                              <tr key={i}>
                                <td className="mono bold">{d.date}</td>
                                <td className="mono">{d.test}</td>
                                <td className="mono"><span className={`type-badge ${d.live > 0 ? 'live' : 'test'}`}>{d.live}</span></td>
                                <td className="mono bold">{d.flights}</td>
                                <td className="mono">{Math.round(d.distance)} km</td>
                                <td>
                                  <div style={{ display: 'flex', gap: 2, height: 8 }}>
                                    {d.test > 0 && d.flights > 0 && <div style={{ width: `${d.test / d.flights * 100}%`, background: 'var(--border)', borderRadius: 2, minWidth: 4 }} />}
                                    {d.live > 0 && d.flights > 0 && <div style={{ width: `${d.live / d.flights * 100}%`, background: 'var(--pink)', borderRadius: 2, minWidth: 4 }} />}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody></table>
                      </div>
                    </div>
                  )}

                  {/* Detection altitude data */}
                  {(() => {
                    const withAlt = displayFlights.filter(f => f.detAlt)
                    if (withAlt.length === 0) return null
                    return (
                      <div className="panel" style={{ marginBottom: 28 }}>
                        <div className="panel-head">
                          <span className="panel-title">Detection Altitude Records</span>
                          <span className="panel-green">{withAlt.length} RECORDS</span>
                        </div>
                        <div className="panel-body">
                          <table className="data-table"><thead><tr>
                            <th>Date</th><th>Flight</th><th>Pilot</th><th>Det. Alt</th><th>Landing Offset</th><th>Precland</th><th>LFAO</th>
                          </tr></thead><tbody>
                              {withAlt.map((f, i) => (
                                <tr key={i}>
                                  <td className="mono">{f.date}</td>
                                  <td className="mono bold">{f.flightId}</td>
                                  <td>{f.pilot}</td>
                                  <td className="mono bold">{f.detAlt}m</td>
                                  <td className="mono">{f.landOff ? `${f.landOff}m` : '-'}</td>
                                  <td><span className={`type-badge ${f.precland === 'On Marker' ? 'live' : 'test'}`}>{f.precland}</span></td>
                                  <td style={{ color: f.lfao === 'Worked' ? 'var(--green)' : f.lfao?.includes('Partial') ? 'var(--amber)' : 'var(--text-3)', fontWeight: 600, fontSize: 12 }}>{f.lfao}</td>
                                </tr>
                              ))}
                            </tbody></table>
                        </div>
                      </div>
                    )
                  })()}
                </ErrorBoundary>
              </motion.div>
            )}

            {/* ═══ FLEET ═══ */}
            {tab === 'fleet' && (
              <motion.div key="fl" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="fleet-tab-layout">

                {/* Map section — full width, contained */}
                <div className="fleet-map-section">
                  <FleetMap drones={liveDrones} />
                </div>

                {/* Stale data banner */}
                {droneStatus.isStale && droneStatus.isCached && (
                  <div style={{ padding: '10px 16px', background: 'rgba(208, 56, 1, 0.08)', border: '1px solid rgba(208, 56, 1, 0.2)', borderRadius: 8, marginTop: 16, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--amber)' }}>
                    <span style={{ fontSize: 16 }}>⚠</span>
                    <span><strong>Cached data</strong> · FMS backend unreachable · Last updated <strong>{droneStatus.ageText}</strong> · {droneStatus.failCount} failed attempt{droneStatus.failCount !== 1 ? 's' : ''}</span>
                  </div>
                )}
                {liveDrones.length > 0 && liveDrones[0]?._fromMetadata && (
                  <div style={{ padding: '10px 16px', background: 'rgba(107, 114, 128, 0.08)', border: '1px solid rgba(107, 114, 128, 0.2)', borderRadius: 8, marginTop: 16, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--text-3)' }}>
                    <span style={{ fontSize: 16 }}>📡</span>
                    <span><strong>Metadata only</strong> · No live telemetry available · Showing registered aircraft from Supabase</span>
                  </div>
                )}

                {/* Live Fleet Status */}
                <div className="section-header" style={{ marginTop: 24, marginBottom: 16 }}>
                  <h2 className="section-title">Live Fleet Status</h2>
                  <span className="section-count">
                    {liveDrones.length > 0 ? `${liveDrones.length} tracked` : `${uavs.length} UAVs`}
                    {droneStatus.isStale && ' · STALE'}
                  </span>
                </div>

                <div className="fleet-grid">
                  {/* Live drone cards — from tracking API */}
                  {liveDrones.length > 0 ? liveDrones.map(drone => {
                    const statusInfo = getStatusInfo(drone.status)
                    // Find matching UAV stats from flight log
                    const uavStat = uavs.find(u => u.id === drone.id)
                    return (
                      <div className="fleet-card" key={drone.id}>
                        <div className="fleet-top">
                          <span className="fleet-id">{drone.aircraftName || drone.id}</span>
                          <span className={`fleet-status ${statusInfo.cssClass}`}>{statusInfo.label}</span>
                        </div>

                        {/* Live telemetry */}
                        <div className="fleet-telemetry">
                          <div className="telem-item">
                            <span className="telem-label">Speed</span>
                            <span className="telem-value">{(drone.groundspeed || 0).toFixed(1)}<span className="telem-unit">m/s</span></span>
                          </div>
                          <div className="telem-item">
                            <span className="telem-label">Altitude</span>
                            <span className="telem-value">{Math.round(drone.alt || 0)}<span className="telem-unit">m</span></span>
                          </div>
                          <div className="telem-item">
                            <span className="telem-label">Heading</span>
                            <span className="telem-value">{Math.round(drone.heading || 0)}<span className="telem-unit">°</span></span>
                          </div>
                          <div className="telem-item">
                            <span className="telem-label">Battery</span>
                            <span className="telem-value" style={{ color: drone.batteryRemaining != null && drone.batteryRemaining < 30 ? 'var(--pink)' : undefined }}>
                              {drone.batteryRemaining != null ? `${drone.batteryRemaining}` : '—'}<span className="telem-unit">%</span>
                            </span>
                          </div>
                        </div>

                        {/* Voltage + temp row */}
                        {(drone.voltage || drone.temperature) && (
                          <div className="fleet-extra-row">
                            {drone.voltage != null && <span>⚡ {drone.voltage.toFixed(1)}V</span>}
                            {drone.temperature != null && <span>🌡️ {drone.temperature.toFixed(1)}°C</span>}
                            {drone.lat != null && <span style={{ fontFamily: 'var(--mono)' }}>📍 {drone.lat.toFixed(4)}, {drone.lon.toFixed(4)}</span>}
                          </div>
                        )}

                        {/* Flight log stats if available */}
                        {uavStat && (
                          <div className="fleet-stats">
                            <span>Flights <strong>{uavStat.flights}</strong></span>
                            <span>Distance <strong>{Math.round(uavStat.distance)}km</strong></span>
                            <span>Live <strong>{uavStat.live}</strong></span>
                            <span>Airtime <strong>{Math.floor(uavStat.minutes / 60)}h{uavStat.minutes % 60}m</strong></span>
                          </div>
                        )}
                      </div>
                    )
                  }) : (
                    /* Fallback: show UAV stats from flight log if API not reachable */
                    uavs.map(u => (
                      <div className="fleet-card" key={u.id}>
                        <div className="fleet-top">
                          <span className="fleet-id">{u.id}</span>
                          <span className="fleet-status grey">NO TELEMETRY</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 18 }}>
                          <div>
                            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Flights</div>
                            <div style={{ fontFamily: 'var(--display)', fontSize: 24, fontWeight: 800, marginTop: 4 }}>{u.flights}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Distance</div>
                            <div style={{ fontFamily: 'var(--display)', fontSize: 24, fontWeight: 800, marginTop: 4 }}>{Math.round(u.distance)}<span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-3)' }}>km</span></div>
                          </div>
                          <div>
                            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Airtime</div>
                            <div style={{ fontFamily: 'var(--display)', fontSize: 24, fontWeight: 800, marginTop: 4 }}>{Math.floor(u.minutes / 60)}h{u.minutes % 60}m</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Payload</div>
                            <div style={{ fontFamily: 'var(--display)', fontSize: 24, fontWeight: 800, marginTop: 4 }}>{(u.payload / 1000).toFixed(1)}<span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-3)' }}>kg</span></div>
                          </div>
                        </div>
                        <div className="fleet-stats">
                          <span>Live <strong>{u.live}</strong></span>
                          <span>Test <strong>{u.test}</strong></span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Flights by UAV */}
                {hasData && <>
                  <div className="section-header" style={{ marginTop: 28 }}>
                    <h2 className="section-title">Flights by Aircraft</h2>
                  </div>
                  {uavs.map(u => {
                    const uavFlights = displayFlights.filter(f => f.uav === u.id)
                    return (
                      <div key={u.id} className="table-card" style={{ marginBottom: 16 }}>
                        <div className="panel-head">
                          <span className="panel-title">{u.id}</span>
                          <span className="panel-green">{uavFlights.length} FLIGHTS</span>
                        </div>
                        <div className="table-wrap">
                          <table className="data-table"><thead><tr>
                            <th>Date</th><th>ID</th><th>Type</th><th>Pilot</th><th>Route</th><th>Dist</th><th>Dur</th><th>Payload</th><th>Precland</th>
                          </tr></thead><tbody>
                              {[...uavFlights].reverse().slice(0, 10).map((f, i) => (
                                <tr key={i}>
                                  <td className="mono">{f.date}</td>
                                  <td className="mono bold">{f.flightId}</td>
                                  <td><span className={`type-badge ${f.type === 'Live' ? 'live' : 'test'}`}>{f.type}</span></td>
                                  <td>{f.pilot}</td>
                                  <td style={{ color: 'var(--text)' }}>{f.from} → {f.to}</td>
                                  <td className="mono">{f.distance > 0 ? `${f.distance}` : '-'}</td>
                                  <td className="mono">{f.duration}</td>
                                  <td className="mono">{f.payload > 0 ? `${f.payload}g` : '-'}</td>
                                  <td><span className={`type-badge ${f.precland === 'On Marker' ? 'live' : 'test'}`}>{f.precland?.replace('Marker', '')}</span></td>
                                </tr>
                              ))}
                            </tbody></table>
                        </div>
                      </div>
                    )
                  })}
                </>}
              </motion.div>
            )}

            {/* ═══ FLIGHTS ═══ */}
            {tab === 'flights' && (
              <motion.div key="flt" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <div className="section-header" style={{ marginTop: 4 }}>
                  <h2 className="section-title">Complete Flight Log</h2>
                  <span className="section-count">{displayFlights.length} records</span>
                </div>
                {hasData ? (
                  <div className="table-card">
                    <div className="table-wrap">
                      <table className="data-table"><thead><tr>
                        <th>Date</th><th>Flight ID</th><th>UAV</th><th>Type</th><th>Pilot</th><th>From</th><th>To</th><th>Dist</th><th>Takeoff</th><th>Landing</th><th>Dur</th><th>Payload</th><th>FLS</th><th>Precland</th><th>LFAO</th>
                      </tr></thead><tbody>
                          {[...displayFlights].reverse().map((f, i) => (
                            <tr key={i}>
                              <td className="mono">{f.date}</td>
                              <td className="mono bold">{f.flightId}</td>
                              <td className="mono">{f.uav}</td>
                              <td><span className={`type-badge ${f.type === 'Live' ? 'live' : 'test'}`}>{f.type}</span></td>
                              <td>{f.pilot}</td>
                              <td>{f.from}</td>
                              <td>{f.to}</td>
                              <td className="mono">{f.distance > 0 ? `${f.distance}` : '-'}</td>
                              <td className="mono">{f.takeoff}</td>
                              <td className="mono">{f.landing}</td>
                              <td className="mono">{f.duration}</td>
                              <td className="mono">{f.payload > 0 ? `${f.payload}g` : '-'}</td>
                              <td style={{ color: f.fls === 'Use' ? 'var(--green)' : 'var(--text-3)', fontSize: 12, fontWeight: 600 }}>{f.fls}</td>
                              <td><span className={`type-badge ${f.precland === 'On Marker' ? 'live' : 'test'}`} style={{ fontSize: 9 }}>{f.precland}</span></td>
                              <td style={{ color: f.lfao === 'Worked' ? 'var(--green)' : f.lfao?.includes('Partial') ? 'var(--amber)' : 'var(--text-3)', fontSize: 12, fontWeight: 600 }}>{f.lfao}</td>
                            </tr>
                          ))}
                        </tbody></table>
                    </div>
                  </div>
                ) : <NoData period={period} />}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        <footer className="site-footer">
          <div className="footer-status"><span className="footer-dot" />All Systems Nominal</div>
          <span>Redwing Labs · AP Network © 2026</span>
        </footer>
      </>}
    </div >
  )
}
