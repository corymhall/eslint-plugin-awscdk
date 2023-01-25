import * as path from 'path';
import { TSESLint } from '@typescript-eslint/utils';
import rule from '../src/rules/no-policy-allow-kms-decrypt';

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
  actions: ['kms:Decrypt'],
});
`,
    },
    {
      code: `
import * as iam from '@aws-cdk/aws-iam';
new iam.PolicyStatement({
  effect: iam.Effect.DENY,
  resources: ['*'],
  actions: ['kms:Decrypt'],
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
  actions: ['kms:Decrypt'],
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
  actions: ['kms:*'],
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
  actions: ['kms:ReEncryptFrom'],
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
  actions: ['kms:Decrypt'],
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
  actions: ['kms:ReEncryptFrom'],
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
