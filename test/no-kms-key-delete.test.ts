import * as path from 'path';
import { TSESLint } from '@typescript-eslint/experimental-utils';
import rule from '../src/rules/no-kms-key-delete';

// let linter: ESLint;
const ruleTester = new TSESLint.RuleTester({
  parser: path.resolve('./node_modules/@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
});

ruleTester.run('no-kms-key-delete', rule, {
  valid: [
    {
      code: `
import * as kms from '@aws-cdk/aws-kms';

new kms.Key(this, 'Key', {
  removalPolicy: cdk.RemovalPolicy.RETAIN,
});
`,
    },
    {
      code: `
import * as kms from '@aws-cdk/aws-kms';

new kms.Key(this, 'Key');
`,
    },
  ],
  invalid: [
    {
      code: `
import * as kms from '@aws-cdk/aws-kms';

new kms.Key(this, 'Key', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
`,
      errors: [
        {
          messageId: 'kmsKeyDoNotDelete',
          suggestions: [
            {
              messageId: 'kmsKeyDoNotDelete',
              output: `
import * as kms from '@aws-cdk/aws-kms';

new kms.Key(this, 'Key', {
  removalPolicy: cdk.RemovalPolicy.RETAIN,
});
`,
            },
          ],
        },
      ],
      output: null,
    },
  ],
});