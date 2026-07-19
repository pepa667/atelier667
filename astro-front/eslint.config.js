import astroPlugin from 'eslint-plugin-astro';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  ...astroPlugin.configs.recommended,
  eslintConfigPrettier,
  {
    rules: {
      // Suas regras adicionais aqui
    },
  },
];
