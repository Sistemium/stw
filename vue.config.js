const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true,
      enableBridge: false,
    },
  },
  devServer: {
    port: 8890,
    allowedHosts: 'all',
    proxy: {
      '^/api': {
        // target: 'http://localhost:9390',
        target: 'https://vfsd.sistemium.com',
      },
      '/ims/': {
        target: 'https://stw.sistemium.com',
        // target: 'http://localhost:8088/api/image',
        changeOrigin: true,
        // pathRewrite: {
        //   '^/ims': '',
        //   // '^/ims/dr50': '',
        // },
      },
    },
  },
});
