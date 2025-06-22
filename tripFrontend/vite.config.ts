import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  define: {
    'process.env': process.env,
    global: 'globalThis',
  },
  server: {
    host: true, // Cho phép truy cập từ bên ngoài
    port: 5173,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.ngrok.io',
      '.ngrok-free.app',
      'd06a-14-241-131-46.ngrok-free.app' // Thêm host ngrok cụ thể
    ]
  }
})