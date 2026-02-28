import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['**/dist/', '.astro/'] },

  // Build scripts
  {
    files: ['packages/plugin/scripts/**/*.js', 'packages/site/scripts/**/*.js'],
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'prefer-const': 'error',
      'no-var': 'error'
    }
  },

  // Site source — TypeScript
  {
    files: ['packages/site/src/**/*.ts'],
    extends: tseslint.configs.recommended
  },

  // Site source — Astro
  ...eslintPluginAstro.configs['flat/recommended']
);
