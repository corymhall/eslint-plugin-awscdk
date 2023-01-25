import { TypeScriptAppProject } from 'projen/lib/typescript';

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
    allowedUsernames: ['corymhall'],
    secret: 'GITHUB_TOKEN',
  },

  depsUpgradeOptions: {
    workflowOptions: {
      labels: ['auto-approve'],
    },
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
    '@typescript-eslint/utils',
    '@typescript-eslint/parser',
    'eslint',
  ],

  tsconfig: {
    compilerOptions: {
      esModuleInterop: true,
    },
  },
});

project.npmignore?.exclude('assets');
project.synth();
