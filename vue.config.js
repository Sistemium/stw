const { defineConfig } = require('@vue/cli-service');
const SentryWebpackPlugin = require('@sentry/webpack-plugin');

const plugins = process.env.NODE_ENV === 'production' ? [
  new SentryWebpackPlugin({
    org: 'sistemium',
    project: 'stw',
    release: `${process.env.npm_package_name}@${process.env.npm_package_version}`,

    // Specify the directory containing build artifacts
    include: './dist',
    // ignore: ['node_modules', 'webpack.config.js'],

    // Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
    // and needs the `project:releases` and `org:read` scopes
    authToken: process.env.SENTRY_AUTH_TOKEN,

    // Optionally uncomment the line below to override automatic release name detection
    // release: process.env.RELEASE,
  }),
] : [];

module.exports = defineConfig({
  transpileDependencies: true,
  parallel: !plugins.length,
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true,
      enableBridge: false,
    },
  },
  chainWebpack(config) {
    config.resolve.alias.set('vue', '@vue/compat');

    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => ({
        ...options,
        compilerOptions: {
          compatConfig: {
            MODE: 2,
          },
        },
      }));
  },
  configureWebpack: {
    devtool: 'source-map',
    plugins,
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
      '/xlsx': {
        // target: 'http://localhost:3300',
        target: 'https://stw.sistemium.com',
      },
    },
  },
});
