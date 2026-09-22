/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  '**/*.ts?(x)': filenames =>
    filenames.length > 10
      ? 'bunx --bun @biomejs/biome lint --write'
      : `bunx --bun @biomejs/biome lint --write ${filenames.join(' ')} `,
  '**.{html,md,json,yml,ts,tsx,cts,mts,js,jsx,cjs,mjs,css,scss}': filenames =>
    filenames.length > 10
      ? 'bunx --bun @biomejs/biome format --write'
      : `bunx --bun @biomejs/biome format --write ${filenames.join(' ')}`
};
