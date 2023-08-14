import { resolve } from 'node:path'
import { loadEnv } from 'vite'
import type { ConfigEnv, UserConfigExport } from 'vite'
import vue from '@vitejs/plugin-vue'

export default (configEnv: ConfigEnv): UserConfigExport => {
  const viteEnv = loadEnv(configEnv.mode, process.cwd()) as ImportMetaEnv
  const { VITE_PUBLIC_PATH } = viteEnv
  return {
    base: VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        /** @ 符号指向 src 目录 */
        '@': resolve(__dirname, './src'),
      },
    },
    server: {
      /** 是否开启 HTTPS */
      https: false,
      /** 设置 host: true 才可以使用 Network 的形式，以 IP 访问项目 */
      host: true,
      /** 端口号 */
      port: 3333,
      /** 是否自动打开浏览器 */
      open: false,
      /** 端口被占用时，是否直接退出 */
      strictPort: false,
      /** 跨域设置允许 */
      cors: true,
      /** 接口代理 */
      proxy: {
        '/api/v1': {
          target: '',
          ws: true,
          /** 是否允许跨域 */
          changeOrigin: true,
          rewrite: path => path.replace('/api/v1', ''),
        },
      },
    },
    build: {
      /** 消除打包大小超过 500kb 警告 */
      chunkSizeWarningLimit: 2000,
      /** Vite 2.6.x 以上需要配置 minify: "terser", terserOptions 才能生效 */
      minify: 'terser',
      /** 在打包代码时移除 console.log、debugger 和 注释 */
      terserOptions: {
        compress: {
          drop_console: false,
          drop_debugger: true,
          pure_funcs: ['console.log'],
        },
        format: {
          /** 删除注释 */
          comments: false,
        },
      },
      /** 打包后静态资源目录 */
      assetsDir: 'static',
    },
    plugins: [
      vue(),
    ],
  }
}
