import { TypeScriptAppProject } from 'projen';

const project = new TypeScriptAppProject({
  defaultReleaseBranch: 'main',
  name: 'eslint-plugin-awscdk',
  projenrcTs: true,
  repository: 'https://github.com/corymhall/eslint-plugin-awscdk',

  stale: false,
  package: true,
  release: true,
  releaseToNpm: true,
  entrypoint: 'lib/index.js',

  autoApproveUpgrades: true,
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
  },

  devDeps: [
    '@types/eslint',
    '@types/jest',
    '@types/node',
    '@typescript-eslint/eslint-plugin',
    'jest',
    'typescript',
  ],

  deps: [
    '@typescript-eslint/experimental-utils',
    '@typescript-eslint/parser',
    'eslint',
  ],

  tsconfig: {
    compilerOptions: {
      esModuleInterop: true,
    },
  },
});

project.synth();
