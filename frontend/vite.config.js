import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Ambiente: 'local' usa wrangler dev (porta 8787), 'prod' usa API de produção
const API_TARGET = process.env.VITE_API_TARGET || 'local'

const apiTargets = {
  local: 'http://localhost:8787',
  prod: 'https://api.partituras25.com'
}

if (API_TARGET === 'prod') {
  console.warn('\n⚠️  ATENÇÃO: Usando API de PRODUÇÃO! Mudanças afetarão dados reais.\n')
}

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@screens': path.resolve(__dirname, './src/screens'),
      '@admin': path.resolve(__dirname, './src/admin'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@styles': path.resolve(__dirname, './src/styles')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom']
        }
      }
    }
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: apiTargets[API_TARGET],
        changeOrigin: true,
        secure: API_TARGET === 'prod'
      }
    }
  },
  preview: {
    port: 4173,
    proxy: {
      '/api': {
        target: apiTargets[API_TARGET],
        changeOrigin: true,
        secure: API_TARGET === 'prod'
      }
    }
  }
})
