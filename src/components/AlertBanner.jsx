import { motion } from 'framer-motion'

export default function AlertBanner({ message = "BLOCKER: DENSE FOG UNTIL 1000 - REDUCED VISIBILITY OPS" }) {
  return (
    <motion.div
      className="alert-banner"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="hazard-stripe"></div>

      <div className="alert-content">
        <div className="alert-icon">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M11 2L20 18H2L11 2Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
            <path d="M11 9V12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="11" cy="15" r="1.2" fill="currentColor" />
          </svg>
        </div>
        <span className="alert-message">{message}</span>
      </div>

      <div className="alert-status">
        <span className="alert-code">WX-001</span>
        <div className="alert-pulse pulse"></div>
      </div>

      <style>{`
        .alert-banner {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 20px 14px 0;
          background: linear-gradient(90deg, rgba(255, 167, 38, 0.06) 0%, rgba(255, 167, 38, 0.02) 100%);
          border: 1px solid rgba(255, 167, 38, 0.2);
          border-radius: var(--radius);
          box-shadow: 
            0 0 30px rgba(255, 167, 38, 0.06),
            inset 0 0 60px rgba(255, 167, 38, 0.02);
          position: relative;
          overflow: hidden;
        }
        
        .hazard-stripe {
          width: 8px;
          height: 100%;
          min-height: 50px;
          background: repeating-linear-gradient(
            -45deg,
            #FFA726,
            #FFA726 4px,
            #1a1a1a 4px,
            #1a1a1a 8px
          );
          flex-shrink: 0;
          border-radius: var(--radius) 0 0 var(--radius);
        }
        
        .alert-content {
          display: flex;
          align-items: center;
          gap: 14px;
          flex: 1;
        }
        
        .alert-icon {
          color: var(--amber-warning);
          display: flex;
          align-items: center;
          flex-shrink: 0;
          filter: drop-shadow(0 0 6px rgba(255, 167, 38, 0.5));
        }
        
        .alert-message {
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 600;
          color: var(--amber-warning);
          letter-spacing: 0.8px;
          text-shadow: var(--amber-glow);
        }
        
        .alert-status {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        
        .alert-code {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          color: #666;
          letter-spacing: 1px;
          padding: 4px 8px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
        }
        
        .alert-pulse {
          width: 10px;
          height: 10px;
          background: var(--amber-warning);
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(255, 167, 38, 0.5);
        }
        
        @media (max-width: 768px) {
          .alert-banner {
            padding: 12px 14px 12px 0;
          }
          
          .alert-message {
            font-size: 10px;
          }
          
          .alert-code {
            display: none;
          }
        }
      `}</style>
    </motion.div>
  )
}
