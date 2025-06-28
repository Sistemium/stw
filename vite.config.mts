import vue from '@vitejs/plugin-vue'
// import eslint from 'vite-plugin-eslint';
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import vueDevTools from 'vite-plugin-vue-devtools'
import Vuetify from 'vite-plugin-vuetify'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dotEnv from 'dotenv-flow'
import { VitePWA } from 'vite-plugin-pwa'

dotEnv.config()

const { PWA_MODE } = process.env

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const release = `${process.env.npm_package_name}@${process.env.npm_package_version}`
  console.log('release:', release, PWA_MODE)
  return {
    plugins: [
      vue({}),
      vueJsx(),
      VitePWA({
        mode: PWA_MODE ? 'development' : 'production',
        strategies: 'injectManifest',
        injectManifest: {
          rollupFormat: 'iife',
          injectionPoint: undefined,
        },
        manifest: false,
        registerType: 'autoUpdate',
        srcDir: 'src/workers',
        filename: 'firebase-messaging-sw.ts',
        devOptions: PWA_MODE ? {
          enabled: true,
          type: 'module',
        } : undefined,
      }),
      Vuetify({
        autoImport: true,
        styles: {
          configFile: 'src/styles/settings.scss',
        },
      }),
      sentryVitePlugin({
        org: 'sistemium',
        project: 'stw',
        authToken: env.SENTRY_AUTH_TOKEN,
        release,
        injectRelease: !PWA_MODE,
        include: './dist',
        sourcemaps: {
          assets: './dist/**',
        },
      }),
      vueDevTools({
        launchEditor: 'webstorm',
      }),
      createHtmlPlugin({}),
    ],
    define: {
      'process.env': {},
      __VUE_I18N_FULL_INSTALL__: true,
      __VUE_I18N_LEGACY_API__: false,
      // __INTLIFY_PROD_DEVTOOLS__: false,
    },
    build: {
      // minify: false,
      sourcemap: 'hidden',
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
      extensions: [
        '.js',
        '.json',
        '.jsx',
        '.mjs',
        '.ts',
        '.tsx',
        '.vue',
      ],
    },
    server: {
      port: 8890,
      proxy: {
        '^/api': {
          target: process.env.DEV_SERVER_PROXY_TARGET || 'http://localhost:9390',
          changeOrigin: true,
        },
        '/socket.io': {
          target: process.env.DEV_SERVER_WS_TARGET || process.env.DEV_SERVER_PROXY_TARGET,
          changeOrigin: true,
          ws: true,
        },
        '/pha': {
          target: process.env.DEV_SERVER_PHA_TARGET || 'https://oauth.it/pha',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/pha/, ''),
        },
        '/xlsx': {
          // target: 'http://localhost:3300',
          target: 'https://stw.sistemium.com',
          changeOrigin: true,
        },
        '/ims/': {
          target: 'https://stw.sistemium.com',
          changeOrigin: true,
        },
      },
    },
  }
})
