import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 🚨 AÑADIR ESTA SECCIÓN PARA EL PROXY
  server: {
    // Opcional: Si quieres que Vite SIEMPRE use 5173 y no otro puerto
    port: 5173, 
    
    proxy: {
      // Redirigir todas las peticiones que empiecen con /api
      '/api': {
        // Apuntar al puerto donde corre tu backend (NestJS)
        // (Asumimos 5000 según tu 'main.ts')
        target: 'http://localhost:5000', 
        
        // Necesario para que el backend acepte la petición
        changeOrigin: true, 
      },
    },
  },
})