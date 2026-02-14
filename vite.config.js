import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const trackingApi = env.VITE_TRACKING_API || 'https://tifany-uncalm-melani.ngrok-free.dev'

  return {
    plugins: [react()],
    server: {
      proxy: {
        // Proxy /tracking-api/* → FMS backend via ngrok (bypasses CORS + interstitial)
        '/tracking-api': {
          target: trackingApi,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/tracking-api/, ''),
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'User-Agent': 'RedwingDashboard/1.0',
            'Authorization': `Bearer ${env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhbWhna3FraGJpdXB3amt2dm1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5ODI2OTgsImV4cCI6MjA3MDU1ODY5OH0.EAv2d5ekddn_So4hkqVqotnc4o9rVrGmlVdiTqS2AbM'}`,
          },
        },
      },
    },
  }
})
