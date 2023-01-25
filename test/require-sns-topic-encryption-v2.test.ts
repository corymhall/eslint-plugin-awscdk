import * as path from 'path';
import { TSESLint } from '@typescript-eslint/utils';
import rule from '../src/rules/require-sns-topic-encryption';

// let linter: ESLint;
const ruleTester = new TSESLint.RuleTester({
  parser: path.resolve('./node_modules/@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
});

ruleTester.run('require-sns-topic-encryption', rule, {
  valid: [
    {
      code: `
import * as cdk from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as kms from 'aws-cdk-lib/aws-kms';

const key = new kms.Key(this, 'Key');

new sns.Topic(this, 'Test', {
  masterKey: key,
});
`,
    },
  ],
  invalid: [
    {
      code: `
import { aws_sns as sns } from 'aws-cdk-lib';

new sns.Topic(this, 'Test');
`,
      errors: [
        {
          messageId: 'missingEncryption',
        },
      ],
    },
    {
      code: `
import { aws_sns as sns } from 'aws-cdk-lib';

new sns.Topic(this, 'Test', {
  topicName: 'test',
});
`,
      errors: [
        {
          messageId: 'missingEncryption',
        },
      ],
      output: null,
    },
  ],
});
