import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173, // Your React app's port, ensure this is correct
    proxy: {
      '/api': { // This means any request starting with /api
        target: 'http://localhost:5000', // Will be proxied to this target
        changeOrigin: true, // This is important for CORS
        rewrite: (path) => path.replace(/^\/api/, ''), // Optional: rewrites the path. If your backend expects /register, not /api/register
      },
      
    }
  }
})
