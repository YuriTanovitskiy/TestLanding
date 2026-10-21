import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { bookingPlugin } from './server/bookingPlugin.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), bookingPlugin()],
  server: {
    watch: { ignored: ['**/.local-bookings/**', '**/.edge-header-check/**'] },
    fs: { deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**', '**/.local-bookings/**'] },
  },
})
