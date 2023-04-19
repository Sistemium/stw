import vue from '@vitejs/plugin-vue';
import eslint from 'vite-plugin-eslint';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  // optimizeDeps: {
  //   include: ['sistemium-data'],
  // },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          compatConfig: {
            MODE: 3,
          },
        },
      },
    }),
    eslint({
      include: ['src/**/*.ts', 'src/**/*.vue', 'src/*.ts', 'src/*.vue'],
    }),
    legacy({
      ignoreBrowserslistConfig: true,
      targets: ['defaults', 'not IE 11'],
      modernPolyfills: false,
    }),
  ],
  define: {
    'process.env': {},
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: true,
    // __INTLIFY_PROD_DEVTOOLS__: false,
  },
  build: {
    // minify: false,
  },
  resolve: {
    alias: {
      vue: '@vue/compat',
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
        target: 'https://vfsd.sistemium.com',
        // target: 'http://localhost:3105',
        changeOrigin: true,
        // rewrite: path => path.replace(/^\/api/, ''),
      },
      '/pha': {
        target: 'http://localhost:3130',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/pha/, ''),
      },
    },
  },
});
