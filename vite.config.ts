import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

  ],
  server: {
    host: 'localhost', // This will allow external connections
    port: 5173, // Choose your preferred port
    strictPort: true, // Prevent switching to a different port if the specified one is already in use
  },
  preview: {
    allowedHosts: [
      'localhost',
    ], // allow all hosts
  },
})
