// Vercel serverless function — proxies tracking API requests to bypass ngrok interstitial + CORS
// Usage: /api/tracking?path=/get_supabase_data

const NGROK_URL = process.env.VITE_TRACKING_API || 'https://tifany-uncalm-melani.ngrok-free.dev'
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhbWhna3FraGJpdXB3amt2dm1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5ODI2OTgsImV4cCI6MjA3MDU1ODY5OH0.EAv2d5ekddn_So4hkqVqotnc4o9rVrGmlVdiTqS2AbM'

export default async function handler(req, res) {
    const path = req.query.path || '/get_supabase_data'

    try {
        const response = await fetch(`${NGROK_URL}${path}`, {
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
                'User-Agent': 'RedwingDashboard/1.0',
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            },
        })

        if (!response.ok) {
            return res.status(response.status).json({ error: `API returned ${response.status}` })
        }

        const data = await response.json()

        // Allow CORS from the Vercel frontend
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Cache-Control', 'no-cache, no-store')
        return res.status(200).json(data)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}
