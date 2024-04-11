module.exports = {
  extends: [
    'plugin:astro/base',
    'plugin:astro/recommended',
    'plugin:astro/jsx-a11y-strict',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  overrides: [
    {
      files: ['*.astro'],
      processor: 'astro/client-side-ts',
      plugins: ['astro'],
      env: {
        node: true,
        'astro/astro': true,
        es2020: true,
      },
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
        sourceType: 'module',
      },
      rules: {
        'astro/no-conflict-set-directives': 'error',
        'astro/no-unused-define-vars-in-style': 'error',
      },
    },
    {
      files: ['*.ts'],
      plugins: ['@typescript-eslint'],
      env: {
        browser: true,
        es2020: true,
      },
      parser: '@typescript-eslint/parser',
      parserOptions: {
        sourceType: 'module',
        project: 'tsconfig.json',
      },
      rules: {
        'import/no-named-as-default': 'off',
        'no-unused-vars': [
          'error',
          {
            vars: 'all',
            args: 'after-used',
            argsIgnorePattern: '^_',
            ignoreRestSiblings: false,
          },
        ],
        'prettier/prettier': 'error',
        '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: ['variable'],
            types: ['boolean'],
            format: ['PascalCase'],
            prefix: ['is', 'should', 'has', 'can', 'did', 'will'],
          },
          {
            selector: ['parameter'],
            leadingUnderscore: 'allow',
            format: ['camelCase', 'snake_case'],
          },
          {
            selector: ['function', 'variable'],
            format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          },
          {
            selector: ['variable'],
            modifiers: ['destructured'],
            format: [],
          },
          {
            selector: ['parameter'],
            modifiers: ['destructured'],
            format: ['camelCase', 'snake_case', 'PascalCase'],
          },
          {
            selector: ['interface', 'typeAlias'],
            format: ['PascalCase'],
            custom: {
              regex: 'ImportMetaEnv|Props$|Type$',
              match: true,
            },
          },
          {
            selector: ['class'],
            format: ['PascalCase'],
          },
        ],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-misused-promises': [
          'error',
          {
            checksVoidReturn: false,
          },
        ],
        '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unused-vars': ['error'],
        '@typescript-eslint/no-useless-empty-export': 'error',
        '@typescript-eslint/prefer-optional-chain': 'error',
        '@typescript-eslint/triple-slash-reference': 'off',
        '@typescript-eslint/type-annotation-spacing': [
          'error',
          {
            before: false,
            after: true,
            overrides: {
              arrow: {
                before: true,
                after: true,
              },
            },
          },
        ],
      },
    },
  ],
};
