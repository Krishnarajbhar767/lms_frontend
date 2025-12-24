import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ["babel-plugin-react-compiler", { /* optional config options here */ }],
        ],
      },
    }),
    tailwindcss(),
  ],
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
  },
  preview: {
    allowedHosts: [
      'localhost',
    ],
  },
})
