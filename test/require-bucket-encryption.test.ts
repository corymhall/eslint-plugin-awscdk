import * as path from 'path';
import { TSESLint } from '@typescript-eslint/experimental-utils';
import rule from '../src/rules/require-bucket-encryption';

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
import * as cloudfront from 'monocdk/aws-cloudfront';
import * as iam from 'monocdk/aws-iam';
import * as s3 from 'monocdk/aws-s3';

import * as ssm from 'monocdk/aws-ssm';

export interface StorageProps {
  projectName: string;
  appName: string;
}

export class Storage extends cdk.Construct {
  public readonly bucket: s3.IBucket;
  public readonly oai: cloudfront.IOriginAccessIdentity;

  constructor(scope: cdk.Construct, id: string, props: StorageProps) {
    super(scope, id);

    const bucket = new s3.Bucket(this, 'StorageBucket', {
      encryption: s3.BucketEncryption.KMS_MANAGED,
      publicReadAccess: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      bucketName: cdk.PhysicalName.GENERATE_IF_NEEDED,
    });
  }
}
`,
    },
    {
      code: `
import * as s3 from '@aws-cdk/aws-s3';

new s3.Bucket(this, 'TestBucket', {
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
import * as cdk from 'monocdk';
import * as cloudfront from 'monocdk/aws-cloudfront';
import * as iam from 'monocdk/aws-iam';
import * as s3 from 'monocdk/aws-s3';

import * as ssm from 'monocdk/aws-ssm';

export interface StorageProps {
  projectName: string;
  appName: string;
}

export class Storage extends cdk.Construct {
  public readonly bucket: s3.IBucket;
  public readonly oai: cloudfront.IOriginAccessIdentity;

  constructor(scope: cdk.Construct, id: string, props: StorageProps) {
    super(scope, id);

    const bucket = new s3.Bucket(this, 'StorageBucket', {
      publicReadAccess: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      bucketName: cdk.PhysicalName.GENERATE_IF_NEEDED,
    });
  }
}
`,
      errors: [
        {
          messageId: 'missingEncryption',
          suggestions: [
            {
              messageId: 'enableKmsManagedEncryption',
              output: `
import * as cdk from 'monocdk';
import * as cloudfront from 'monocdk/aws-cloudfront';
import * as iam from 'monocdk/aws-iam';
import * as s3 from 'monocdk/aws-s3';

import * as ssm from 'monocdk/aws-ssm';

export interface StorageProps {
  projectName: string;
  appName: string;
}

export class Storage extends cdk.Construct {
  public readonly bucket: s3.IBucket;
  public readonly oai: cloudfront.IOriginAccessIdentity;

  constructor(scope: cdk.Construct, id: string, props: StorageProps) {
    super(scope, id);

    const bucket = new s3.Bucket(this, 'StorageBucket', {
    encryption: s3.BucketEncryption.KMS_MANAGED,
      publicReadAccess: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      bucketName: cdk.PhysicalName.GENERATE_IF_NEEDED,
    });
  }
}
`,
            },
          ],
        },
      ],
    },
    {
      code: `
import { aws_s3 as s3 } from 'monocdk/aws-s3';

new s3.Bucket(this, 'TestBucket', {
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    bucketName: cdk.PhysicalName.GENERATE_IF_NEEDED,
});
`,
      errors: [
        {
          messageId: 'missingEncryption',
          suggestions: [
            {
              messageId: 'enableKmsManagedEncryption',
              output: `
import { aws_s3 as s3 } from 'monocdk/aws-s3';

new s3.Bucket(this, 'TestBucket', {
    encryption: s3.BucketEncryption.KMS_MANAGED,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
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
    {
      code: `
import { Bucket } from 'monocdk/aws-s3';

new Bucket(this, 'TestBucket', {
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    bucketName: cdk.PhysicalName.GENERATE_IF_NEEDED,
});
`,
      errors: [
        {
          messageId: 'missingEncryption',
          suggestions: [
            {
              messageId: 'enableKmsManagedEncryption',
              output: `
import { Bucket } from 'monocdk/aws-s3';

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
        },
      ],
      output: null,
    },
  ],
});