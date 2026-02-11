import { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function HeroLanding({ onEnter }) {
  useEffect(() => {
    const timer = setTimeout(() => onEnter(), 2800)
    return () => clearTimeout(timer)
  }, [onEnter])

  return (
    <motion.div
      className="hero-landing"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="hero-badge">REDWING OPS COMMAND</div>
        <h1 className="hero-title">Fleet Intelligence<br />& Operations</h1>
        <p className="hero-subtitle">Real-time monitoring for drone fleet operations</p>
        <div className="hero-loader">
          <motion.div
            className="loader-bar"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.2, delay: 0.4, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>

      <style>{`
        .hero-landing {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-primary);
          z-index: 1000;
        }
        
        .hero-content {
          text-align: center;
          max-width: 480px;
          padding: 0 24px;
        }
        
        .hero-badge {
          display: inline-block;
          padding: 5px 12px;
          background: var(--bg-muted);
          border: 1px solid var(--border-subtle);
          border-radius: 20px;
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          color: var(--text-secondary);
          letter-spacing: 1px;
          margin-bottom: 20px;
        }
        
        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(28px, 5vw, 44px);
          font-weight: 700;
          line-height: 1.15;
          color: var(--text-primary);
          letter-spacing: -0.5px;
          margin-bottom: 12px;
        }
        
        .hero-subtitle {
          font-family: var(--font-sans);
          font-size: 14px;
          color: var(--text-muted);
          margin-bottom: 28px;
        }
        
        .hero-loader {
          width: 120px;
          height: 3px;
          background: var(--border-subtle);
          border-radius: 2px;
          margin: 0 auto;
          overflow: hidden;
        }
        
        .loader-bar {
          height: 100%;
          background: var(--accent-primary);
          border-radius: 2px;
        }
      `}</style>
    </motion.div>
  )
}
