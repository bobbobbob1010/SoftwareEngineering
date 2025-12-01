import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { searchForWorkspaceRoot } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 1. 외부 파일 접근 허용 (아까 했던 설정)
  server: {
    fs: {
      allow: [
        searchForWorkspaceRoot(process.cwd()),
        path.resolve(__dirname, '../../frontend'), 
      ],
    },
  },

  // 2. [핵심] 외부 파일이 내 라이브러리를 쓰도록 연결(Alias)
  resolve: {
    alias: {
      // "외부 파일에서 axios를 찾으면 -> 내 node_modules에 있는 걸 줘라"
      'axios': path.resolve(__dirname, 'node_modules/axios'),
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-router-dom': path.resolve(__dirname, 'node_modules/react-router-dom'),
    },
  },

  // 3. .js 파일에서도 JSX 문법 허용
  esbuild: {
    loader: "tsx", 
    include: /src\/.*\.[tj]sx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx', 
      },
    },
  },
})