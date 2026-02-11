import { motion } from 'framer-motion'

const FLEET_DATA = [
  {
    id: 'AS04',
    name: 'Alpha-04',
    status: 'AIRBORNE',
    statusColor: 'var(--accent-success)',
    vibration: { x: 0.12, y: 0.08, z: 0.22 },
    batteryCycles: 142,
    maxCycles: 500,
    ekfStatus: 'FIXED'
  },
  {
    id: 'AS05',
    name: 'Alpha-05',
    status: 'STANDBY',
    statusColor: 'var(--accent-warning)',
    vibration: { x: 0.08, y: 0.15, z: 0.07 },
    batteryCycles: 87,
    maxCycles: 500,
    ekfStatus: 'FIXED'
  }
]

function HealthBar({ label, value, max = 1, color = 'var(--accent-primary)' }) {
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
      <span className="health-value">{value.toFixed(2)}</span>
    </div>
  )
}

export default function FleetHealthMatrix() {
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
          <span className="count-value">2</span>
          <span className="count-label">Assets</span>
        </div>
      </div>

      <div className="asset-grid">
        {FLEET_DATA.map((asset, index) => (
          <motion.div
            key={asset.id}
            className="asset-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
          >
            <div className="asset-header">
              <div className="asset-identity">
                <span className="asset-id">{asset.id}</span>
                <span className="asset-name">{asset.name}</span>
              </div>
              <span className="asset-status" style={{ color: asset.statusColor }}>
                {asset.status}
              </span>
            </div>

            <div className="asset-metrics">
              <div className="metric-group">
                <span className="group-label">Vibration Levels</span>
                <HealthBar label="X-Axis" value={asset.vibration.x} max={0.5} color="var(--accent-primary)" />
                <HealthBar label="Y-Axis" value={asset.vibration.y} max={0.5} color="var(--accent-primary)" />
                <HealthBar label="Z-Axis" value={asset.vibration.z} max={0.5} color="var(--accent-primary)" />
              </div>

              <div className="asset-footer">
                <div className="footer-stat">
                  <span className="stat-label">Battery Cycles</span>
                  <span className="stat-value">{asset.batteryCycles}/{asset.maxCycles}</span>
                </div>
                <div className="footer-stat">
                  <span className="stat-label">EKF Status</span>
                  <span className="stat-value status-good">{asset.ekfStatus}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <style>{`
        .fleet-health {
          padding: 0;
          overflow: hidden;
        }
        
        .fleet-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          border-bottom: 1px solid var(--border-subtle);
        }
        
        .fleet-title {
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .fleet-count {
          display: flex;
          align-items: baseline;
          gap: 5px;
        }
        
        .count-value {
          font-family: var(--font-mono);
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .count-label {
          font-family: var(--font-sans);
          font-size: 11px;
          color: var(--text-muted);
        }
        
        .asset-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }
        
        .asset-card {
          padding: 16px 18px;
          border-right: 1px solid var(--border-subtle);
        }
        
        .asset-card:last-child {
          border-right: none;
        }
        
        .asset-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }
        
        .asset-identity {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }
        
        .asset-id {
          font-family: var(--font-mono);
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .asset-name {
          font-family: var(--font-sans);
          font-size: 12px;
          color: var(--text-muted);
        }
        
        .asset-status {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.3px;
        }
        
        .metric-group {
          margin-bottom: 14px;
        }
        
        .group-label {
          display: block;
          font-family: var(--font-sans);
          font-size: 10px;
          font-weight: 500;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.3px;
          margin-bottom: 8px;
        }
        
        .health-bar-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 5px;
        }
        
        .health-label {
          font-family: var(--font-sans);
          font-size: 11px;
          color: var(--text-secondary);
          min-width: 45px;
        }
        
        .health-bar-container {
          flex: 1;
          height: 5px;
          background: var(--bg-muted);
          border-radius: 2px;
          overflow: hidden;
        }
        
        .health-bar-fill {
          height: 100%;
          border-radius: 2px;
        }
        
        .health-value {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 500;
          color: var(--text-secondary);
          min-width: 32px;
          text-align: right;
        }
        
        .asset-footer {
          display: flex;
          gap: 16px;
          padding-top: 12px;
          border-top: 1px solid var(--border-subtle);
        }
        
        .footer-stat {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .stat-label {
          font-family: var(--font-sans);
          font-size: 10px;
          color: var(--text-muted);
        }
        
        .stat-value {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 500;
          color: var(--text-primary);
        }
        
        .stat-value.status-good {
          color: var(--accent-success);
        }
        
        @media (max-width: 640px) {
          .asset-card {
            border-right: none;
            border-bottom: 1px solid var(--border-subtle);
          }
          
          .asset-card:last-child {
            border-bottom: none;
          }
        }
      `}</style>
    </motion.div>
  )
}
