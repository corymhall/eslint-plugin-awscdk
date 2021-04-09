import * as path from 'path';
import { TSESLint } from '@typescript-eslint/experimental-utils';
import rule from '../src/rules/require-bucket-private';

// let linter: ESLint;
const ruleTester = new TSESLint.RuleTester({
  parser: path.resolve('./node_modules/@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
});

ruleTester.run('require-bucket-private', rule, {
  valid: [
    {
      code: `
import * as s3 from '@aws-cdk/aws-s3';
import { aws_s3 as s3 } from 'monocdk/aws-s3';

new s3.Bucket(this, 'TestBucket', {
    encryption: s3.BucketEncryption.KMS_MANAGED,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    publicReadAccess: false,
    autoDeleteObjects: true,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    bucketName: cdk.PhysicalName.GENERATE_IF_NEEDED,
});
`,
    },
    {
      code: `
import * as s3 from '@aws-cdk/aws-s3';
import { aws_s3 as s3 } from 'monocdk/aws-s3';

new s3.Bucket(this, 'TestBucket');
`,
    },
    {
      code: `
import { Bucket } from '@aws-cdk/aws-s3';

new Bucket(this, 'TestBucket', {
    encryption: s3.BucketEncryption.KMS_MANAGED,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    bucketName: cdk.PhysicalName.GENERATE_IF_NEEDED,
});
`,
    },
  ],
  invalid: [
    {
      code: `
import * as s3 from '@aws-cdk/aws-s3';
import { Bucket } from '@aws-cdk/aws-s3';
import { aws_s3 as s3 } from 'monocdk/aws-s3';

new s3.Bucket(this, 'TestBucket', {
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
    publicReadAccess: true,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    bucketName: cdk.PhysicalName.GENERATE_IF_NEEDED,
});
`,
      errors: [
        {
          messageId: 'publicBucket',
          suggestions: [
            {
              messageId: 'bucketShouldBePrivate',
              output: `
import * as s3 from '@aws-cdk/aws-s3';
import { Bucket } from '@aws-cdk/aws-s3';
import { aws_s3 as s3 } from 'monocdk/aws-s3';

new s3.Bucket(this, 'TestBucket', {
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
    publicReadAccess: false,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    bucketName: cdk.PhysicalName.GENERATE_IF_NEEDED,
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