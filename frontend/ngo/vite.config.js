import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const devPort = Number(env.VITE_DEV_PORT)
  const apiProxyTarget = env.VITE_API_PROXY_TARGET

  if (!Number.isFinite(devPort) || devPort <= 0) {
    throw new Error('VITE_DEV_PORT must be set in frontend/ngo/.env (e.g. 5173)')
  }
  if (!apiProxyTarget) {
    throw new Error(
      'VITE_API_PROXY_TARGET must be set in frontend/ngo/.env (e.g. http://127.0.0.1:5000)'
    )
  }

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: devPort,
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
