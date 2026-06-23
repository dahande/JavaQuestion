import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages のプロジェクトページ (https://dahande.github.io/JavaQuestion/) に
// 公開するため base を '/JavaQuestion/' に設定する。
export default defineConfig({
  base: '/JavaQuestion/',
  plugins: [react()],
})
