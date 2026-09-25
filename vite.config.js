import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Fixed port: Sanity only answers origins on its CORS allow-list (sanity.io/manage -> API -> CORS origins).
  server: { port: 5174, strictPort: true },
})
