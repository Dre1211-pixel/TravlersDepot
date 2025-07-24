import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 如果是 production 環境，設置正確的 base 路徑用於 GitHub Pages 部署
  base: process.env.NODE_ENV === 'production' ? '/TravelersDepot/' : '/',
})
