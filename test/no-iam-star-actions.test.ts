import * as path from 'path';
import { TSESLint } from '@typescript-eslint/experimental-utils';
import rule from '../src/rules/no-iam-star-actions';

// let linter: ESLint;
const ruleTester = new TSESLint.RuleTester({
  parser: path.resolve('./node_modules/@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
});

/**
 * Testing scenarios
 *
 */

ruleTester.run('no-ipv4-from-anywhere', rule, {
  valid: [
    {
      code: `
import * as iam from '@aws-cdk/aws-iam';
new iam.PolicyStatement({
  resources: ['*'],
  actions: ['s3:GetObject'],
});
`,
    },
  ],
  invalid: [
    {
      code: `
import * as iam from '@aws-cdk/aws-iam';
new iam.PolicyStatement({
  resources: ['*'],
  actions: ['*'],
});
`,
      errors: [
        {
          messageId: 'noIamStarActions',
        },
      ],
    },
    {
      code: `
import { PolicyStatement } from '@aws-cdk/aws-iam';
new PolicyStatement({
  resources: ['*'],
  actions: ['s3:*'],
});
`,
      errors: [
        {
          messageId: 'noIamStarActions',
        },
      ],
    },
  ],
});