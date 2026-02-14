import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        // Proxy /tracking-api/* → backend API (bypasses CORS + network issues)
        '/tracking-api': {
          target: env.VITE_TRACKING_API || 'http://100.102.218.97:8061',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/tracking-api/, ''),
        },
      },
    },
  }
})
