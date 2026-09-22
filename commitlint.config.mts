import type { UserConfig } from '@commitlint/types';

const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feature',
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert'
      ]
    ],
    'scope-empty': [2, 'always'],
    'subject-full-stop': [0],
    'subject-case': [0],
    'header-max-length': [2, 'always', 2000],
    'body-max-length': [2, 'always', 5000],
    'body-max-line-length': [2, 'always', 2000],
    'scope-case': [0]
  }
};

export default config;
