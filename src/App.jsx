import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FLIGHT_DATA, computeMetrics, getRouteStats, getPilotStats, getUAVStats, getDailyStats, getNodeStats } from './data/flights'
import './App.css'

function ts() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })
}

/* ─── Splash ─── */
function Splash({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 800); return () => clearTimeout(t) }, [onDone])
  return (
    <motion.div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1C0067', zIndex: 2000 }}
      initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
      <motion.div style={{ textAlign: 'center' }} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.1 }}>
        <div style={{ fontFamily: 'var(--display)', fontSize: 36, fontWeight: 800, color: 'white', letterSpacing: 2 }}>REDWING</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: 3, marginTop: 4, fontWeight: 600 }}>OPERATIONS DASHBOARD</div>
        <div style={{ width: 48, height: 3, background: 'rgba(255,255,255,0.1)', margin: '20px auto 0', borderRadius: 2, overflow: 'hidden' }}>
          <motion.div style={{ height: '100%', background: '#FF2080', borderRadius: 2 }} initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.4, delay: 0.2, ease: 'easeInOut' }} />
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Mini bar chart ─── */
function BarChart({ data, maxVal, color = 'var(--pink)', height = 80 }) {
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
  const pct = Math.min(value / max, 1)
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

/* ─── App ─── */
export default function App() {
  const [ready, setReady] = useState(false)
  const [tab, setTab] = useState('overview')
  const [clock, setClock] = useState(ts())
  useEffect(() => { const t = setInterval(() => setClock(ts()), 1000); return () => clearInterval(t) }, [])

  const m = useMemo(() => computeMetrics(FLIGHT_DATA), [])
  const routes = useMemo(() => getRouteStats(FLIGHT_DATA), [])
  const pilots = useMemo(() => getPilotStats(FLIGHT_DATA), [])
  const uavs = useMemo(() => getUAVStats(FLIGHT_DATA), [])
  const daily = useMemo(() => getDailyStats(FLIGHT_DATA), [])
  const nodes = useMemo(() => getNodeStats(FLIGHT_DATA), [])

  const hours = Math.floor(m.totalMinutes / 60)
  const mins = m.totalMinutes % 60

  // Precland & LFAO stats
  const preclandOn = FLIGHT_DATA.filter(f => f.precland === 'On Marker').length
  const preclandOff = FLIGHT_DATA.filter(f => f.precland === 'Off Marker').length
  const lfaoWorked = FLIGHT_DATA.filter(f => f.lfao === 'Worked').length
  const lfaoPartial = FLIGHT_DATA.filter(f => f.lfao && f.lfao.includes('Partial')).length
  const lfaoDisable = FLIGHT_DATA.filter(f => f.lfao === 'Disable').length

  return (
    <div className="app">
      <AnimatePresence>
        {!ready && <Splash key="s" onDone={() => setReady(true)} />}
      </AnimatePresence>

      {ready && <>
        <header className="header">
          <div className="logo">
            <span className="logo-mark">Redwing</span>
            <div className="logo-divider" />
            <span className="logo-sub">Operations</span>
          </div>
          <nav className="nav-tabs">
            {['overview', 'analytics', 'fleet', 'flights'].map(t => (
              <button key={t} className={`nav-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
            ))}
          </nav>
          <div className="header-right">
            <span className="header-time">{clock} IST</span>
            <div className="live-pill"><span className="pulse-dot" />LIVE</div>
          </div>
        </header>

        <div className="content">
          <AnimatePresence mode="wait">

            {/* ═══ OVERVIEW ═══ */}
            {tab === 'overview' && (
              <motion.div key="ov" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>

                <div className="hero-banner">
                  <div className="hero-label">Andhra Pradesh · Paderu—Araku Corridor</div>
                  <div className="hero-title">Flight Operations Dashboard</div>
                  <div className="hero-sub">{m.totalFlights} flights · {m.liveCount} live deliveries · {m.pilotCount} pilots · {m.locationCount} nodes</div>
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
                    <div className="stat-footer">across {m.liveCount + m.testCount} sorties</div>
                  </div>
                </div>

                {/* Daily activity chart + Route table */}
                <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
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
                        <span>Most active: <strong style={{ color: 'var(--text)' }}>{daily.reduce((a, b) => b.flights > a.flights ? b : a).date}</strong> ({daily.reduce((a, b) => b.flights > a.flights ? b : a).flights} flights)</span>
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
                <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
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
                  <span className="section-count">{FLIGHT_DATA.length} total</span>
                </div>
                <div className="table-card">
                  <div className="table-wrap">
                    <table className="data-table"><thead><tr>
                      <th>Date</th><th>ID</th><th>UAV</th><th>Type</th><th>Pilot</th><th>Route</th><th>Dist</th><th>Dur</th><th>Payload</th>
                    </tr></thead><tbody>
                        {[...FLIGHT_DATA].reverse().slice(0, 8).map((f, i) => (
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
              </motion.div>
            )}

            {/* ═══ ANALYTICS ═══ */}
            {tab === 'analytics' && (
              <motion.div key="an" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>

                <div className="section-header" style={{ marginTop: 4 }}>
                  <h2 className="section-title">System Analytics</h2>
                  <span className="section-count">V 2.0</span>
                </div>

                {/* Precland + LFAO */}
                <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
                  <div className="stat-card" style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                    <Ring value={preclandOn} max={preclandOn + preclandOff} size={64} color="var(--green)" />
                    <div>
                      <div className="stat-label">Precision Landing</div>
                      <div className="stat-value" style={{ fontSize: 28 }}>{Math.round(preclandOn / (preclandOn + preclandOff) * 100)}%</div>
                      <div className="stat-footer"><span className="up">{preclandOn}</span> on-marker · {preclandOff} off-marker</div>
                    </div>
                  </div>
                  <div className="stat-card" style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                    <Ring value={lfaoWorked} max={lfaoWorked + lfaoPartial + lfaoDisable} size={64} color="var(--blue)" />
                    <div>
                      <div className="stat-label">LFAO Script</div>
                      <div className="stat-value" style={{ fontSize: 28 }}>{lfaoWorked + lfaoPartial}/{lfaoWorked + lfaoPartial + lfaoDisable}</div>
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
                                {d.test > 0 && <div style={{ width: `${d.test / d.flights * 100}%`, background: 'var(--border)', borderRadius: 2, minWidth: 4 }} />}
                                {d.live > 0 && <div style={{ width: `${d.live / d.flights * 100}%`, background: 'var(--pink)', borderRadius: 2, minWidth: 4 }} />}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody></table>
                  </div>
                </div>

                {/* Detection altitude data */}
                {(() => {
                  const withAlt = FLIGHT_DATA.filter(f => f.detAlt)
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
              </motion.div>
            )}

            {/* ═══ FLEET ═══ */}
            {tab === 'fleet' && (
              <motion.div key="fl" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <div className="section-header" style={{ marginTop: 4 }}>
                  <h2 className="section-title">Fleet Status</h2>
                  <span className="section-count">{uavs.length} UAVs</span>
                </div>

                <div className="fleet-grid">
                  {uavs.map(u => {
                    const isAS04 = u.id === 'AS04'
                    return (
                      <div className="fleet-card" key={u.id}>
                        <div className="fleet-top">
                          <span className="fleet-id">{u.id}</span>
                          <span className={`fleet-status ${isAS04 ? 'green' : 'amber'}`}>{isAS04 ? 'ACTIVE' : 'STANDBY'}</span>
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
                          <span>FLS <strong style={{ color: 'var(--green)' }}>{u.live > 0 ? 'ACTIVE' : 'N/A'}</strong></span>
                          <span>System <strong style={{ color: 'var(--green)' }}>V 2.0</strong></span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Flights by UAV */}
                <div className="section-header" style={{ marginTop: 28 }}>
                  <h2 className="section-title">Flights by Aircraft</h2>
                </div>
                {uavs.map(u => {
                  const flights = FLIGHT_DATA.filter(f => f.uav === u.id)
                  return (
                    <div key={u.id} className="table-card" style={{ marginBottom: 16 }}>
                      <div className="panel-head">
                        <span className="panel-title">{u.id}</span>
                        <span className="panel-green">{flights.length} FLIGHTS</span>
                      </div>
                      <div className="table-wrap">
                        <table className="data-table"><thead><tr>
                          <th>Date</th><th>ID</th><th>Type</th><th>Pilot</th><th>Route</th><th>Dist</th><th>Dur</th><th>Payload</th><th>Precland</th>
                        </tr></thead><tbody>
                            {[...flights].reverse().slice(0, 10).map((f, i) => (
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
              </motion.div>
            )}

            {/* ═══ FLIGHTS ═══ */}
            {tab === 'flights' && (
              <motion.div key="flt" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <div className="section-header" style={{ marginTop: 4 }}>
                  <h2 className="section-title">Complete Flight Log</h2>
                  <span className="section-count">{FLIGHT_DATA.length} records</span>
                </div>
                <div className="table-card">
                  <div className="table-wrap">
                    <table className="data-table"><thead><tr>
                      <th>Date</th><th>Flight ID</th><th>UAV</th><th>Type</th><th>Pilot</th><th>From</th><th>To</th><th>Dist</th><th>Takeoff</th><th>Landing</th><th>Dur</th><th>Payload</th><th>FLS</th><th>Precland</th><th>LFAO</th>
                    </tr></thead><tbody>
                        {[...FLIGHT_DATA].reverse().map((f, i) => (
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
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        <footer className="site-footer">
          <div className="footer-status"><span className="footer-dot" />All Systems Nominal</div>
          <span>Redwing Labs · AP Network © 2026</span>
        </footer>
      </>}
    </div>
  )
}
