module.exports = {
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
    proxy: {
      '^/api': {
        target: 'http://localhost:9390',
        changeOrigin: true,
      },
    },
  },
};
