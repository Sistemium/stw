// const unusedImports = require('eslint-plugin-unused-imports')
// require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  env: {
    node: true,
  },
  globals: {
    definePage: 'readonly',
  },
  // plugins: ['eslint-plugin-unused-imports'],
  extends: [
    // 'plugin:vue/vue3-essential',
    // 'eslint:recommended',
    // '@vue/eslint-config-typescript',
    // 'plugin:vue-pug/vue3-recommended',
    // '@vue/eslint-config-prettier/skip-formatting',
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    'plugin:vue-pug/vue3-recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  rules: {
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-unused-imports': 'off',
    // '@typescript-eslint/no-unused-vars': 'off',
    // 'unused-imports/no-unused-imports': 'error',
    // 'unused-imports/no-unused-vars': [
    //   'warn',
    //   {
    //     'vars': 'all',
    //     'varsIgnorePattern': '^_',
    //     'args': 'after-used',
    //     'argsIgnorePattern': '^_',
    //   },
    // ]
  },
}
