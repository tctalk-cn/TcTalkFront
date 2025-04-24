import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'url';
// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                // 这里只能写合法的 SCSS 语法
                additionalData: `
                                     @use "@/assets/scss/theme.scss" as *;
                                `
            }
        }
    },
    server: {
        port: 3005,
    },
});
