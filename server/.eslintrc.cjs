module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  plugins: ['prettier', 'jsdoc'],
  extends: ['eslint:recommended', 'plugin:prettier/recommended', 'prettier'],
  globals: {
    describe: 'readonly',
    it: 'readonly',
    expect: 'readonly',
    beforeAll: 'readonly',
    afterAll: 'readonly',
    beforeEach: 'readonly',
    afterEach: 'readonly',
    jest: 'readonly',
    module: 'readonly',
  },
  rules: {
    quotes: [2, 'single', 'avoid-escape'],
    semi: [2, 'always'],
    'no-unused-vars': [
      1,
      {
        vars: 'all',
        args: 'all',
        argsIgnorePattern: 'res|next|^err|event|^_',
        ignoreRestSiblings: true,
      },
    ],
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'es5',
        singleQuote: true,
        tabWidth: 2,
        semi: true,
        printWidth: 100,
      },
    ],
    'no-extra-boolean-cast': 'off',
    'comma-spacing': [
      'error',
      {
        before: false,
        after: true,
      },
    ],
    'function-call-argument-newline': ['warn', 'consistent'],
    'no-multiple-empty-lines': [
      'warn',
      {
        max: 1,
        maxEOF: 0,
      },
    ],
    'no-negated-condition': 'error',
    'no-unused-expressions': [
      'warn',
      {
        allowShortCircuit: true,
        allowTernary: true,
      },
    ],
    'object-property-newline': [
      'warn',
      {
        allowAllPropertiesOnSameLine: false,
      },
    ],
    'object-curly-newline': [
      'warn',
      {
        ObjectExpression: {
          consistent: true,
          minProperties: 2,
        },
        ObjectPattern: { multiline: true },
      },
    ],
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: ['const', 'let', 'var'],
        next: '*',
      },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var'],
      },
      {
        blankLine: 'always',
        prev: '*',
        next: 'return',
      },
    ],
    'prefer-const': 'warn',
    'prefer-destructuring': 'warn',
    'space-before-function-paren': 'off',
    'no-async-promise-executor': 'off',
    'no-duplicate-imports': 'warn',
    'one-var': ['error', 'never'],
    'operator-linebreak': 'off',
    'multiline-comment-style': ['warn', 'separate-lines'],
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    curly: ['error', 'all'],
    'func-style': ['warn', 'declaration', { allowArrowFunctions: true }],
    'key-spacing': ['error', { mode: 'strict' }],
    'no-constant-condition': 'error',
    'no-multi-spaces': ['warn', { exceptions: { Property: true } }],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 13,
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
};
