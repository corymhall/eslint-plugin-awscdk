import * as path from 'path';
import { TSESLint } from '@typescript-eslint/experimental-utils';
import rule from '../src/rules/require-bucket-ssl';

// let linter: ESLint;
const ruleTester = new TSESLint.RuleTester({
  parser: path.resolve('./node_modules/@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
});

ruleTester.run('require-bucket-encryption', rule, {
  valid: [
    {
      code: `
import * as cdk from 'monocdk';
import * as s3 from 'monocdk/aws-s3';

new s3.Bucket(this, 'StorageBucket', {
  encryption: s3.BucketEncryption.KMS_MANAGED,
  requireSSL: true,
});
`,
    },
  ],
  invalid: [
    {
      code: `
import * as cdk from 'monocdk';
import * as s3 from 'monocdk/aws-s3';

new s3.Bucket(this, 'StorageBucket', {
  encryption: s3.BucketEncryption.KMS_MANAGED,
  requireSSL: false,
});
`,
      errors: [
        {
          messageId: 'requireSSL',
          suggestions: [
            {
              messageId: 'requireSSL',
              output: `
import * as cdk from 'monocdk';
import * as s3 from 'monocdk/aws-s3';

new s3.Bucket(this, 'StorageBucket', {
  encryption: s3.BucketEncryption.KMS_MANAGED,
  requireSSL: true,
});
`,
            },
          ],
        },
      ],
    },
    {
      code: `
import * as cdk from 'monocdk';
import * as s3 from 'monocdk/aws-s3';

new s3.Bucket(this, 'StorageBucket', {
  encryption: s3.BucketEncryption.KMS_MANAGED,
});
`,
      errors: [
        {
          messageId: 'requireSSL',
          suggestions: [
            {
              messageId: 'requireSSL',
              output: `
import * as cdk from 'monocdk';
import * as s3 from 'monocdk/aws-s3';

new s3.Bucket(this, 'StorageBucket', {
  encryption: s3.BucketEncryption.KMS_MANAGED,
  requireSSL: true,
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
import * as s3 from 'monocdk/aws-s3';

new s3.Bucket(this, 'StorageBucket');
`,
      errors: [
        {
          messageId: 'requireSSL',
        },
      ],
      output: null,
    },
  ],
});