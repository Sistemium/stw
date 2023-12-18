module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:vue-pug/vue3-recommended',
    '@vue/typescript/recommended',
    '@vue/eslint-config-typescript',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'vue',
  ],
  rules: {
    'no-var': 'error',
    // allow paren-less arrow functions
    'arrow-parens': ['error', 'as-needed'],
    // set maximum line characters
    'max-len': ['error', {
      code: 140,
      ignoreUrls: true,
      ignoreTemplateLiterals: true,
      ignoreTrailingComments: true,
    }],
    complexity: ['error', 32],
    quotes: ['error', 'single', {
      avoidEscape: true,
      allowTemplateLiterals: true,
    }],
    'no-console': 'off',
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'only-multiline',
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-return-assign': 'off',
    'no-empty': 'error',
    'array-bracket-spacing': ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'no-return-await': 'warn',
    'object-shorthand': ['error', 'always'],
    'no-extra-semi': 'error',
    'prefer-const': ['error', {
      destructuring: 'all',
      ignoreReadBeforeAssign: true,
    }],
    'no-prototype-builtins': 'off',
    'no-void': 'off',
    'no-case-declarations': 'off',
    // 'sort-imports': ['warn', {
    //   ignoreDeclarationSort: true,
    //   ignoreCase: true,
    // }],
    'multiline-ternary': 'off',

    // Not in override, these apply to non-.vue files too
    'vue/require-default-prop': 'off',
    'vue/require-prop-types': 'off',
    'vue/one-component-per-file': 'off',
    'vue/custom-event-name-casing': ['error', { ignores: ['/^[a-z]+(?:-[a-z]+)*:[a-z]+(?:-[a-z]+)*$/u'] }],
    'vue/max-attributes-per-line': 'off',
    'sort-imports': 'off',
    'vue/attributes-order': 'off',
    'vue/order-in-components': 'off',
    'vue/require-explicit-emits': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
