const js = require('@eslint/js')
const tsPlugin = require('@typescript-eslint/eslint-plugin')
const tsParser = require('@typescript-eslint/parser')
const { defineConfig } = require('eslint/config')
const { createTypeScriptImportResolver } = require('eslint-import-resolver-typescript')
const importX = require('eslint-plugin-import-x')
const prettierRecommended = require('eslint-plugin-prettier/recommended')
const vuePlugin = require('eslint-plugin-vue')
const globals = require('globals')
const vueParser = require('vue-eslint-parser')

const autoImportConfig = require('./.eslintrc-auto-import.json')

const lintedFiles = ['**/*.{js,cjs,mjs,ts,tsx,vue}']
const ignoredPaths = [
  '**/.cache/**',
  '**/.data/**',
  '**/.nitro/**',
  '**/.nuxt/**',
  '**/.output/**',
  '**/coverage/**',
  '**/dist/**',
  '**/generated/**',
  '**/node_modules/**'
]

module.exports = defineConfig([
  {
    ignores: ignoredPaths
  },
  js.configs.recommended,
  ...tsPlugin.configs['flat/recommended'],
  ...vuePlugin.configs['flat/essential'],
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  prettierRecommended,
  {
    files: lintedFiles,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...autoImportConfig.globals
      }
    },
    settings: {
      'import-x/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx']
      },
      'import/resolver': {
        typescript: {
          project: './tsconfig.json'
        }
      },
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
          noWarnOnMultipleProjects: true,
          project: ['tsconfig.json', 'server/tsconfig.json', '.nuxt/tsconfig.json']
        })
      ]
    },
    rules: {
      'vue/block-order': [
        'error',
        {
          order: ['script:not([setup])', 'script[setup]', 'script[lang=ts]', 'template']
        }
      ],
      'vue/singleline-html-element-content-newline': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/first-attribute-linebreak': [
        'error',
        {
          singleline: 'ignore',
          multiline: 'below'
        }
      ],
      'no-var': 'error',
      'no-dupe-class-members': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-empty-character-class': 'error',
      'no-empty-pattern': 'error',
      'dot-notation': 'off',
      'prefer-regex-literals': 'off',
      '@typescript-eslint/no-duplicate-enum-values': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: true,
          fixStyle: 'separate-type-imports'
        }
      ],
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      'import-x/no-unresolved': 'error',
      'import-x/namespace': ['error', { allowComputed: true }],
      'import-x/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'parent', 'sibling', 'index', 'object', 'type'],
          pathGroups: [
            {
              pattern: '{vue,vue-router,vite,@vitejs/plugin-vue}',
              group: 'builtin',
              position: 'before'
            },
            {
              pattern: '@src/**',
              group: 'parent',
              position: 'before'
            }
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: {
            order: 'asc'
          },
          'newlines-between': 'always'
        }
      ],
      'import-x/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never'
        }
      ],
      'prettier/prettier': [
        'error',
        {
          trailingComma: 'none',
          semi: false,
          printWidth: 100,
          tabWidth: 2,
          useTabs: false,
          singleQuote: true,
          bracketSpacing: true,
          arrowParens: 'always',
          endOfLine: 'lf'
        }
      ]
    }
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        extraFileExtensions: ['.vue'],
        sourceType: 'module'
      }
    }
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser
    },
    rules: {
      'no-undef': 'off'
    }
  },
  {
    files: ['**/*.vue'],
    rules: {
      'no-undef': 'off'
    }
  },
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      'import-x/extensions': 'off',
      'import-x/no-unresolved': 'off',
      'import-x/order': 'off'
    }
  },
  {
    files: ['**/*.cjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off'
    }
  }
])
