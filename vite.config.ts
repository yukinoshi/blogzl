import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { YikeResolver } from '@yike-design/resolver'
// import VueDevTools from 'vite-plugin-vue-devtools'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // Vue Devtools 调试插件（仅开发环境生效）
    // VueDevTools(),
    AutoImport({ resolvers: [YikeResolver] }),
    Components({ resolvers: [YikeResolver] }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        charset: false,
        additionalData: '@import "@yike-design/ui/es/components/styles/basis.less";',
      },
    },
  },
  // 在这里添加 server 配置
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        // 使用 127.0.0.1 避免在某些环境下 localhost 解析为 ::1 导致的连接拒绝
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        // 如需调试，可短期改回 localhost 或使用 devtools 网络面板查看
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,          // 生产环境默认关闭，可按需打开
    target: 'es2018',          // 兼顾现代浏览器
    minify: 'esbuild',
    chunkSizeWarningLimit: 1024,
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', 'vue-router', 'pinia'],
        },
      },
    },
  },
})
