import { motion } from 'framer-motion'
import { getStatusInfo } from '../data/droneTracking'

function HealthBar({ label, value, max = 100, color = 'var(--blue)' }) {
  const percentage = Math.min((value / max) * 100, 100)
  return (
    <div className="health-bar-row">
      <span className="health-label">{label}</span>
      <div className="health-bar-container">
        <motion.div
          className="health-bar-fill"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      <span className="health-value">{typeof value === 'number' ? value.toFixed(1) : value}</span>
    </div>
  )
}

export default function FleetHealthMatrix({ drones = [] }) {
  if (drones.length === 0) return null

  return (
    <motion.div
      className="fleet-health glass-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.25 }}
    >
      <div className="fleet-header">
        <span className="fleet-title">Fleet Health Matrix</span>
        <div className="fleet-count">
          <span className="count-value">{drones.length}</span>
          <span className="count-label">Assets</span>
        </div>
      </div>

      <div className="asset-grid">
        {drones.map((drone, index) => {
          const statusInfo = getStatusInfo(drone.status)
          const batColor = drone.batteryRemaining != null
            ? drone.batteryRemaining > 60 ? 'var(--green)' : drone.batteryRemaining > 30 ? 'var(--amber)' : 'var(--pink)'
            : 'var(--text-3)'

          return (
            <motion.div
              key={drone.id}
              className="asset-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
            >
              <div className="asset-header">
                <div className="asset-identity">
                  <span className="asset-id">{drone.id}</span>
                  <span className="asset-name">{drone.aircraftName || drone.id}</span>
                </div>
                <span className="asset-status" style={{ color: statusInfo.colorHex }}>
                  {statusInfo.label}
                </span>
              </div>

              <div className="asset-metrics">
                {drone.batteryRemaining != null && (
                  <div className="metric-group">
                    <span className="group-label">Battery</span>
                    <HealthBar label="Remaining" value={drone.batteryRemaining} max={100} color={batColor} />
                    {drone.voltage != null && (
                      <HealthBar label="Voltage" value={drone.voltage} max={30} color="var(--blue)" />
                    )}
                  </div>
                )}

                <div className="asset-footer">
                  <div className="footer-stat">
                    <span className="stat-label">Speed</span>
                    <span className="stat-value">{(drone.groundspeed || 0).toFixed(1)} m/s</span>
                  </div>
                  <div className="footer-stat">
                    <span className="stat-label">Altitude</span>
                    <span className="stat-value">{Math.round(drone.alt || 0)}m</span>
                  </div>
                  {drone.temperature != null && (
                    <div className="footer-stat">
                      <span className="stat-label">Temp</span>
                      <span className="stat-value">{drone.temperature.toFixed(1)}°C</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <style>{`
        .fleet-health { padding: 0; overflow: hidden; }
        .fleet-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid var(--border); }
        .fleet-title { font-size: 14px; font-weight: 700; color: var(--text); }
        .fleet-count { display: flex; align-items: baseline; gap: 5px; }
        .count-value { font-family: var(--display); font-size: 18px; font-weight: 800; color: var(--text); }
        .count-label { font-size: 11px; color: var(--text-3); }
        .asset-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
        .asset-card { padding: 16px 18px; border-right: 1px solid var(--border); }
        .asset-card:last-child { border-right: none; }
        .asset-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
        .asset-identity { display: flex; align-items: baseline; gap: 8px; }
        .asset-id { font-family: var(--display); font-size: 15px; font-weight: 700; color: var(--text); }
        .asset-name { font-size: 12px; color: var(--text-3); }
        .asset-status { font-size: 10px; font-weight: 700; letter-spacing: 0.5px; }
        .metric-group { margin-bottom: 14px; }
        .group-label { display: block; font-size: 10px; font-weight: 600; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 8px; }
        .health-bar-row { display: flex; align-items: center; gap: 10px; margin-bottom: 5px; }
        .health-label { font-size: 11px; color: var(--text-3); min-width: 65px; }
        .health-bar-container { flex: 1; height: 5px; background: var(--bg-alt); border-radius: 2px; overflow: hidden; }
        .health-bar-fill { height: 100%; border-radius: 2px; }
        .health-value { font-size: 11px; font-weight: 600; color: var(--text-3); min-width: 36px; text-align: right; font-variant-numeric: tabular-nums; }
        .asset-footer { display: flex; gap: 16px; padding-top: 12px; border-top: 1px solid var(--border); }
        .footer-stat { display: flex; align-items: center; gap: 6px; }
        .footer-stat .stat-label { font-size: 10px; color: var(--text-3); }
        .footer-stat .stat-value { font-size: 11px; font-weight: 600; color: var(--text); }
        @media (max-width: 640px) {
          .asset-card { border-right: none; border-bottom: 1px solid var(--border); }
          .asset-card:last-child { border-bottom: none; }
        }
      `}</style>
    </motion.div>
  )
}
