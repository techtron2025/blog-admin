const path = require('path')
import {fileURLToPath, URL} from 'node:url'
import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// markdown 语法高亮
import prismjs from 'vite-plugin-prismjs'
import compression from 'vite-plugin-compression'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'

//svg矢量图
import {createSvgIconsPlugin} from 'vite-plugin-svg-icons'

import {visualizer} from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
    const env = loadEnv(mode, process.cwd())

    return {
        plugins: [
            AutoImport({
                resolvers: [ElementPlusResolver()],
            }),
            Components({
                resolvers: [ElementPlusResolver()],
            }),
            vue(),
            vueJsx(),
            //svg矢量图配置
            createSvgIconsPlugin({
                iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
                symbolId: 'icon-[dir]-[name]',
            }),
            prismjs({
                languages: ['json', 'css', 'javascript', 'bash', 'docker', 'http'],
            }),
            visualizer({
                filename: 'stats.html',
                open: true,
                gzipSize: true, // 收集 gzip 大小并将其显示
                brotliSize: true, // 收集 brotli 大小并将其显示
            }),
            compression({
                verbose: true, // 输出压缩日志
                disable: false, // 是否禁用压缩
                threshold: 10240, // 对超过10KB的文件进行压缩
                algorithm: 'gzip', // 使用gzip压缩
                ext: '.gz', // 压缩后文件的扩展名
            }),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
            extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'], // 导入时想要省略的扩展名列表
        },
        // scss全局变量配置 全局变量配置在/variable.scss
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@use "./src/assets/css/variable.scss" as *;`, // 全局引入 SCSS 变量
                    silenceDeprecations: ['legacy-js-api'],
                },
            },
        },
        server: {
            open: true,
            host: '0.0.0.0',
            proxy: {
                '/api': env.VITE_URL,
                '/stream': env.VITE_URL,
                '/uploads': env.VITE_URL,
            },
        },
    }
})
