import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8080',
      '/login': {
        target: 'http://localhost:8080',
        bypass(req) {
          if (req.method === 'GET') return req.url
        }
      },
      '/signup': {
        target: 'http://localhost:8080',
        bypass(req) {
          if (req.method === 'GET') return req.url
        }
      },
      '/submitForm': 'http://localhost:8080',
    }
  }
})
