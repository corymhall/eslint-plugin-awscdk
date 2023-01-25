import * as path from 'path';
import { TSESLint } from '@typescript-eslint/utils';
import rule from '../src/rules/require-dynamodb-ptr';

// let linter: ESLint;
const ruleTester = new TSESLint.RuleTester({
  parser: path.resolve('./node_modules/@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
});

ruleTester.run('require-dynamodb-ptr', rule, {
  valid: [
    {
      code: `
import * as cdk from 'monocdk';
import * as dynamodb from 'monocdk/aws-dynamodb';
import * as kms from 'monocdk/aws-kms';

const key = new kms.Key(this, 'Key');

new dynamodb.Table(this, 'Table', {
  pointInTimeRecovery: true,
})
`,
    },
  ],
  invalid: [
    {
      code: `
import * as cdk from 'monocdk';
import * as dynamodb from 'monocdk/aws-dynamodb';

new dynamodb.Table(this, 'Table', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
  pointInTimeRecovery: false,
});
`,
      errors: [
        {
          messageId: 'missingPointInTimeRecovery',
          suggestions: [
            {
              messageId: 'missingPointInTimeRecovery',
              output: `
import * as cdk from 'monocdk';
import * as dynamodb from 'monocdk/aws-dynamodb';

new dynamodb.Table(this, 'Table', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
  pointInTimeRecovery: true,
});
`,
            },
          ],
        },
      ],
      output: null,
    },
    {
      code: `
import * as cdk from 'monocdk';
import * as dynamodb from 'monocdk/aws-dynamodb';

new dynamodb.Table(this, 'Table', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
});
`,
      errors: [
        {
          messageId: 'missingPointInTimeRecovery',
          suggestions: [
            {
              messageId: 'missingPointInTimeRecovery',
              output: `
import * as cdk from 'monocdk';
import * as dynamodb from 'monocdk/aws-dynamodb';

new dynamodb.Table(this, 'Table', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
  pointInTimeRecovery: true,
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
