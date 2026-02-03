import { useState, useEffect, useCallback } from 'react'

const DEFAULT_METRICS = {
    flightCompletion: 114.28,
    otp: 25.0,
    theaterRange: 12895,
    activeAssets: 2
}

const DEFAULT_ALERT = {
    message: "BLOCKER: DENSE FOG UNTIL 1000 - REDUCED VISIBILITY OPS",
    type: "warning",
    active: true
}

export function useDataFetch(csvUrl = null, refreshInterval = 60000) {
    const [metrics, setMetrics] = useState(DEFAULT_METRICS)
    const [alert, setAlert] = useState(DEFAULT_ALERT)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [isSimulating, setIsSimulating] = useState(true)
    const [lastUpdated, setLastUpdated] = useState(new Date())

    const parseCSV = useCallback((csvText) => {
        const lines = csvText.trim().split('\n')
        if (lines.length < 2) return null

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
        const values = lines[1].split(',').map(v => v.trim())

        const data = {}
        headers.forEach((header, index) => {
            data[header] = values[index]
        })

        return data
    }, [])

    const fetchData = useCallback(async () => {
        if (!csvUrl) {
            setIsSimulating(true)
            return
        }

        try {
            setLoading(true)
            const response = await fetch(csvUrl)

            if (!response.ok) throw new Error('Failed to fetch data')

            const csvText = await response.text()
            const data = parseCSV(csvText)

            if (data) {
                setMetrics({
                    flightCompletion: parseFloat(data.flightcompletion || data.flight_completion) || DEFAULT_METRICS.flightCompletion,
                    otp: parseFloat(data.otp) || DEFAULT_METRICS.otp,
                    theaterRange: parseInt(data.theaterrange || data.theater_range || data.distance) || DEFAULT_METRICS.theaterRange,
                    activeAssets: parseInt(data.activeassets || data.active_assets || data.drones) || DEFAULT_METRICS.activeAssets
                })

                if (data.alert || data.alert_message) {
                    setAlert({
                        message: data.alert || data.alert_message,
                        type: data.alert_type || 'warning',
                        active: true
                    })
                }

                setLastUpdated(new Date())
                setIsSimulating(false)
                setError(null)
            }
        } catch (err) {
            setError(err.message)
            setIsSimulating(true)
        } finally {
            setLoading(false)
        }
    }, [csvUrl, parseCSV])

    useEffect(() => {
        fetchData()

        if (csvUrl) {
            const interval = setInterval(fetchData, refreshInterval)
            return () => clearInterval(interval)
        }
    }, [csvUrl, fetchData, refreshInterval])

    useEffect(() => {
        if (!isSimulating) return

        const interval = setInterval(() => {
            setMetrics(prev => ({
                ...prev,
                theaterRange: prev.theaterRange + Math.floor(Math.random() * 3),
                flightCompletion: Math.min(150, prev.flightCompletion + (Math.random() * 0.3 - 0.1))
            }))
            setLastUpdated(new Date())
        }, 5000)

        return () => clearInterval(interval)
    }, [isSimulating])

    return {
        metrics,
        alert,
        loading,
        error,
        isSimulating,
        lastUpdated
    }
}
