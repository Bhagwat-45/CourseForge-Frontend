import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    // Mermaid + Monaco are large but already code-split via React.lazy dynamic imports.
    // Suppress the size warning since these chunks are loaded on-demand, not at startup.
    chunkSizeWarningLimit: 600,
  },
  server: {
    proxy: {
      // Proxy all /api requests to our FastAPI backend
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      }
    },
    watch: {
      ignored: ['**/backend/**']
    }
  }
})
