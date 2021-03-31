import * as path from 'path';
import { TSESLint } from '@typescript-eslint/experimental-utils';
import rule from '../src/rules/no-iam-admin-permissions';

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
  effect: iam.Effect.ALLOW,
  resources: ['abc'],
  actions: ['*'],
});
`,
    },
    {
      code: `
import * as iam from '@aws-cdk/aws-iam';
new iam.PolicyStatement({
  effect: iam.Effect.DENY,
  resources: ['*'],
  actions: ['*'],
});
`,
    },
  ],
  invalid: [
    {
      code: `
import * as iam from '@aws-cdk/aws-iam';
new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
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
import * as iam from '@aws-cdk/aws-iam';
new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  resources: ['*'],
  actions: ['s3:DeleteObject', '*', 's3:GetObject'],
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
import { PolicyStatement, Effect } from '@aws-cdk/aws-iam';
new PolicyStatement({
  effect: Effect.ALLOW,
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
  ],
});