import { motion } from 'framer-motion'

const NODES = [
  { name: 'Tajangi PHC', times: ['00:32', '00:19', '00:45', '00:28'], status: 'active', signal: 95, battery: 82 },
  { name: 'Sunkarametta PHC', times: ['00:28', '00:15', '00:33'], status: 'active', signal: 88, battery: 91 },
  { name: 'Koraput Hub', times: ['01:12', '00:55'], status: 'standby', signal: 72, battery: 45 },
  { name: 'Rayagada Base', times: [], status: 'offline', signal: 0, battery: 0 }
]

export default function NodeMonitor() {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'active': return { color: '#00FF41', label: 'ONLINE', bg: 'rgba(0, 255, 65, 0.08)' }
      case 'standby': return { color: '#FFA726', label: 'STANDBY', bg: 'rgba(255, 167, 38, 0.08)' }
      case 'offline': return { color: '#555', label: 'OFFLINE', bg: 'rgba(85, 85, 85, 0.08)' }
      default: return { color: '#555', label: 'UNKNOWN', bg: 'transparent' }
    }
  }

  return (
    <motion.div
      className="node-monitor glass-card"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <div className="node-header">
        <span className="node-title">NODE HEALTH</span>
        <div className="active-count">
          <span className="count-value">{NODES.filter(n => n.status === 'active').length}</span>
          <span className="count-label">ACTIVE</span>
        </div>
      </div>

      <div className="node-list">
        {NODES.map((node, index) => {
          const config = getStatusConfig(node.status)
          return (
            <motion.div
              key={node.name}
              className="node-row"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.06 }}
            >
              <div className="node-main">
                <div className="node-info">
                  <div className="node-name-row">
                    <div className="status-dot" style={{ background: config.color }}></div>
                    <span className="node-name">{node.name}</span>
                  </div>
                  <div className="node-meta">
                    {node.status !== 'offline' && (
                      <>
                        <span className="meta-item">
                          <span className="meta-label">SIG</span>
                          <span className="meta-value" style={{ color: node.signal > 80 ? '#00FF41' : '#FFA726' }}>{node.signal}%</span>
                        </span>
                        <span className="meta-item">
                          <span className="meta-label">BAT</span>
                          <span className="meta-value" style={{ color: node.battery > 50 ? '#00FF41' : '#FFA726' }}>{node.battery}%</span>
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="status-badge" style={{ color: config.color, background: config.bg }}>
                  {config.label}
                </div>
              </div>

              <div className="timeline">
                {node.times.length > 0 ? (
                  node.times.map((time, i) => (
                    <div key={i} className="time-block">
                      <span>{time}</span>
                    </div>
                  ))
                ) : (
                  <span className="no-data">No activity</span>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="node-footer">
        <span>Wait times (mm:ss)</span>
      </div>

      <style>{`
        .node-monitor {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        .node-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-glass);
        }
        
        .node-title {
          font-family: var(--font-display);
          font-size: 10px;
          font-weight: 600;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        
        .active-count {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .count-value {
          font-family: var(--font-mono);
          font-size: 18px;
          font-weight: 700;
          color: var(--phosphor-green);
          text-shadow: var(--phosphor-glow);
        }
        
        .count-label {
          font-family: var(--font-mono);
          font-size: 9px;
          color: #555;
          letter-spacing: 1px;
        }
        
        .node-list {
          flex: 1;
          padding: 6px 0;
          overflow-y: auto;
        }
        
        .node-row {
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          transition: background 0.2s ease;
        }
        
        .node-row:last-child {
          border-bottom: none;
        }
        
        .node-row:hover {
          background: rgba(255, 255, 255, 0.015);
        }
        
        .node-main {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        
        .node-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .node-name-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        
        .node-name {
          font-size: 13px;
          font-weight: 500;
          color: #e0e0e0;
        }
        
        .node-meta {
          display: flex;
          gap: 12px;
          margin-left: 15px;
        }
        
        .meta-item {
          display: flex;
          gap: 4px;
          align-items: center;
        }
        
        .meta-label {
          font-family: var(--font-mono);
          font-size: 9px;
          color: #555;
        }
        
        .meta-value {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
        }
        
        .status-badge {
          font-family: var(--font-mono);
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 1px;
          padding: 3px 7px;
          border-radius: 4px;
          flex-shrink: 0;
        }
        
        .timeline {
          display: flex;
          gap: 5px;
          margin-left: 15px;
          flex-wrap: wrap;
        }
        
        .time-block {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          padding: 3px 8px;
        }
        
        .time-block span {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 600;
          color: #b0b0b0;
        }
        
        .no-data {
          font-size: 11px;
          color: #444;
          font-style: italic;
        }
        
        .node-footer {
          padding: 8px 16px;
          border-top: 1px solid var(--border-glass);
          background: rgba(0, 0, 0, 0.2);
        }
        
        .node-footer span {
          font-family: var(--font-mono);
          font-size: 9px;
          color: #444;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
      `}</style>
    </motion.div>
  )
}
