import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SIMULATED_ISSUES = [
    { type: 'VIBE', severity: 'warning', message: 'Vibration spike detected at WP3 - Z-axis: 0.42g' },
    { type: 'MAG', severity: 'critical', message: 'Magnetic interference near Tajangi PHC' },
    { type: 'EKF', severity: 'info', message: 'EKF lane switch at T+4:32 - Primary to Secondary' },
    { type: 'BAT', severity: 'warning', message: 'Cell voltage sag: Cell 3 dropped to 3.72V under load' }
]

const HEX_CHARS = '0123456789ABCDEF'

function generateHexLine() {
    const offset = Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0')
    const bytes = Array.from({ length: 16 }, () =>
        Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0')
    ).join(' ')
    return `0x${offset}: ${bytes}`
}

export default function FlightLogProcessor() {
    const [file, setFile] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [progress, setProgress] = useState(0)
    const [currentStage, setCurrentStage] = useState('')
    const [hexLines, setHexLines] = useState([])
    const [detectedIssues, setDetectedIssues] = useState([])
    const [isComplete, setIsComplete] = useState(false)
    const fileInputRef = useRef(null)
    const hexContainerRef = useRef(null)

    const stages = [
        'Parsing MAVLink header...',
        'Extracting GPS timestamps...',
        'Analyzing vibration data...',
        'Checking magnetometer calibration...',
        'Processing EKF telemetry...',
        'Scanning for anomalies...',
        'Generating report...'
    ]

    useEffect(() => {
        if (hexContainerRef.current) {
            hexContainerRef.current.scrollLeft = hexContainerRef.current.scrollWidth
        }
    }, [hexLines])

    const simulateProcessing = async () => {
        setIsProcessing(true)
        setProgress(0)
        setDetectedIssues([])
        setIsComplete(false)

        for (let i = 0; i < stages.length; i++) {
            setCurrentStage(stages[i])

            // Add hex lines during processing
            const hexLinesCount = 3 + Math.floor(Math.random() * 3)
            for (let j = 0; j < hexLinesCount; j++) {
                await new Promise(r => setTimeout(r, 80))
                setHexLines(prev => [...prev.slice(-20), generateHexLine()])
            }

            // Random chance to detect an issue
            if (Math.random() > 0.5 && i > 1 && i < stages.length - 1) {
                const issue = SIMULATED_ISSUES[Math.floor(Math.random() * SIMULATED_ISSUES.length)]
                setDetectedIssues(prev => {
                    if (prev.find(p => p.message === issue.message)) return prev
                    return [...prev, { ...issue, id: Date.now() }]
                })
            }

            setProgress(((i + 1) / stages.length) * 100)
            await new Promise(r => setTimeout(r, 400 + Math.random() * 300))
        }

        setCurrentStage('Analysis complete')
        setIsComplete(true)
        setIsProcessing(false)
    }

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
            setHexLines([])
            simulateProcessing()
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        const droppedFile = e.dataTransfer.files?.[0]
        if (droppedFile) {
            const ext = droppedFile.name.split('.').pop()?.toLowerCase()
            if (['tlog', 'bin', 'log'].includes(ext)) {
                setFile(droppedFile)
                setHexLines([])
                simulateProcessing()
            }
        }
    }

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return '#D32F2F'
            case 'warning': return '#FFA726'
            case 'info': return '#00BCD4'
            default: return '#888'
        }
    }

    return (
        <motion.div
            className="log-processor glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
        >
            <div className="processor-header">
                <div className="processor-title">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 4V12H12V4" stroke="#D32F2F" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M1 2H13V4H1V2Z" stroke="#D32F2F" strokeWidth="1.2" />
                        <path d="M5 7H9" stroke="#D32F2F" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    <span>FLIGHT LOG PROCESSOR</span>
                </div>
                {file && (
                    <div className="file-badge">
                        <span className="file-name">{file.name}</span>
                        <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                    </div>
                )}
            </div>

            {!file && !isProcessing && (
                <div
                    className="upload-zone"
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".tlog,.bin,.log"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                    />
                    <div className="upload-icon">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <path d="M16 4V22" stroke="#555" strokeWidth="2" strokeLinecap="round" />
                            <path d="M10 10L16 4L22 10" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4 22V26C4 27.1 4.9 28 6 28H26C27.1 28 28 27.1 28 26V22" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="upload-text">
                        <span className="upload-primary">Drop flight log or click to upload</span>
                        <span className="upload-secondary">.tlog, .bin, .log files accepted</span>
                    </div>
                </div>
            )}

            {(isProcessing || isComplete) && (
                <div className="processing-view">
                    <div className="progress-section">
                        <div className="progress-header">
                            <span className="stage-text">{currentStage}</span>
                            <span className="progress-pct">{Math.round(progress)}%</span>
                        </div>
                        <div className="progress-track">
                            <motion.div
                                className="progress-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </div>

                    <div className="hex-viewer" ref={hexContainerRef}>
                        {hexLines.map((line, i) => (
                            <span key={i} className="hex-line">{line}</span>
                        ))}
                        {isProcessing && <span className="hex-cursor">█</span>}
                    </div>

                    <AnimatePresence>
                        {detectedIssues.length > 0 && (
                            <motion.div
                                className="issues-section"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <div className="issues-header">
                                    <span>DETECTED ISSUES</span>
                                    <span className="issue-count">{detectedIssues.length}</span>
                                </div>
                                <div className="issues-list">
                                    {detectedIssues.map((issue, i) => (
                                        <motion.div
                                            key={issue.id}
                                            className="issue-item"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <span
                                                className="issue-type"
                                                style={{
                                                    color: getSeverityColor(issue.severity),
                                                    borderColor: getSeverityColor(issue.severity) + '40'
                                                }}
                                            >
                                                {issue.type}
                                            </span>
                                            <span className="issue-msg">{issue.message}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {isComplete && (
                        <button
                            className="reset-btn"
                            onClick={() => {
                                setFile(null)
                                setIsComplete(false)
                                setHexLines([])
                                setDetectedIssues([])
                            }}
                        >
                            ANALYZE ANOTHER LOG
                        </button>
                    )}
                </div>
            )}

            <style>{`
        .log-processor {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-height: 200px;
        }
        
        .processor-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-glass);
        }
        
        .processor-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-display);
          font-size: 10px;
          font-weight: 600;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        
        .file-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 10px;
          background: rgba(0, 188, 212, 0.1);
          border: 1px solid rgba(0, 188, 212, 0.2);
          border-radius: 6px;
        }
        
        .file-name {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--cyan-data);
        }
        
        .file-size {
          font-family: var(--font-mono);
          font-size: 9px;
          color: #666;
        }
        
        .upload-zone {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 32px;
          margin: 16px;
          border: 2px dashed #333;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .upload-zone:hover {
          border-color: var(--redwing-crimson);
          background: rgba(211, 47, 47, 0.05);
        }
        
        .upload-icon {
          opacity: 0.5;
        }
        
        .upload-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          text-align: center;
        }
        
        .upload-primary {
          font-size: 13px;
          color: #888;
        }
        
        .upload-secondary {
          font-family: var(--font-mono);
          font-size: 10px;
          color: #555;
        }
        
        .processing-view {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 14px;
        }
        
        .progress-section {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .stage-text {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--cyan-data);
          letter-spacing: 0.5px;
        }
        
        .progress-pct {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 700;
          color: var(--phosphor-green);
          text-shadow: var(--phosphor-glow);
        }
        
        .progress-track {
          height: 4px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 2px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--cyan-data), var(--phosphor-green));
          box-shadow: 0 0 10px rgba(0, 255, 65, 0.4);
          border-radius: 2px;
        }
        
        .hex-viewer {
          display: flex;
          gap: 12px;
          padding: 10px 12px;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 8px;
          overflow-x: auto;
          white-space: nowrap;
          scrollbar-width: none;
        }
        
        .hex-viewer::-webkit-scrollbar {
          display: none;
        }
        
        .hex-line {
          font-family: var(--font-mono);
          font-size: 9px;
          color: #444;
          flex-shrink: 0;
        }
        
        .hex-cursor {
          font-family: var(--font-mono);
          font-size: 9px;
          color: var(--phosphor-green);
          animation: blink 0.5s infinite;
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        .issues-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 12px;
          background: rgba(255, 167, 38, 0.05);
          border: 1px solid rgba(255, 167, 38, 0.15);
          border-radius: 8px;
        }
        
        .issues-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 9px;
          color: var(--amber-warning);
          letter-spacing: 1.5px;
        }
        
        .issue-count {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          background: rgba(255, 167, 38, 0.2);
          border-radius: 50%;
          font-weight: 700;
        }
        
        .issues-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .issue-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .issue-type {
          font-family: var(--font-mono);
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 1px;
          padding: 2px 6px;
          border: 1px solid;
          border-radius: 3px;
          flex-shrink: 0;
        }
        
        .issue-msg {
          font-family: var(--font-mono);
          font-size: 10px;
          color: #aaa;
        }
        
        .reset-btn {
          align-self: center;
          padding: 10px 20px;
          background: transparent;
          border: 1px solid var(--border-glass);
          border-radius: 8px;
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          color: #888;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .reset-btn:hover {
          border-color: var(--redwing-crimson);
          color: var(--redwing-crimson);
        }
      `}</style>
        </motion.div>
    )
}
