import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react()],
    build: {
      rollupOptions: {
        input: {
          app: './index.html',
          'service-worker': './src/service-worker/serviceWorker.ts',
        },
        output: {
          entryFileNames: assetInfo => {
            return assetInfo.name === 'service-worker'
               ? '[name].js'
               : 'assets/[name]-[hash].js'
          }
        },
      },
    }
  }
})
