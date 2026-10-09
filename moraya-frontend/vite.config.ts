import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: {
    port: 5173,
    // moraya-backend (`npm run dev`) listens on 8787. In development the app calls /api on its own origin and Vite forwards it there;
    // in production set VITE_API_URL to the deployed backend.
    proxy: { '/api': 'http://localhost:8787' },
  },
})
