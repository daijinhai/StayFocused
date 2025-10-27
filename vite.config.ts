import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 代码分割优化
    rollupOptions: {
      output: {
        manualChunks: {
          // 将React相关库分离到单独的chunk
          'react-vendor': ['react', 'react-dom'],
          // 将UI组件库分离
          'ui-vendor': ['lucide-react'],
          // 将国际化相关分离
          'i18n-vendor': ['i18next', 'react-i18next'],
          // 将状态管理分离
          'store-vendor': ['zustand']
        }
      }
    },
    // 启用gzip压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 生产环境移除console
        drop_debugger: true
      }
    },
    // 资源内联阈值
    assetsInlineLimit: 4096,
    // 启用CSS代码分割
    cssCodeSplit: true
  },
  // 开发服务器配置
  server: {
    // 启用HTTP/2
    https: false,
    // 预热常用文件
    warmup: {
      clientFiles: ['./src/main.tsx', './src/App.tsx']
    }
  },
  // 预构建优化
  optimizeDeps: {
    include: ['react', 'react-dom', 'zustand', 'i18next', 'react-i18next'],
    exclude: ['lucide-react']
  }
});
