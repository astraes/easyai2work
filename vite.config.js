import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `$u-primary: #8d1520;`
        // additionalData: '@import "@/styles/theme.scss";'
      }
    }
  }
})
