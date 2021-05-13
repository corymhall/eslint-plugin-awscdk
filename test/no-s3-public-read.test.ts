import * as path from 'path';
import { TSESLint } from '@typescript-eslint/experimental-utils';
import rule from '../src/rules/no-s3-public-read';

// let linter: ESLint;
const ruleTester = new TSESLint.RuleTester({
  parser: path.resolve('./node_modules/@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
});

ruleTester.run('no-s3-public-read', rule, {
  valid: [
    {
      code: `
import * as s3 from '@aws-cdk/aws-s3';

new s3.Bucket(this, 'TestBucket', {
    encryption: s3.BucketEncryption.KMS_MANAGED,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
});
`,
    },
    {
      code: `
import * as s3 from '@aws-cdk/aws-s3';

new s3.Bucket(this, 'TestBucket', {
    blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: true,
        blockPublicPolicy: true,
        ignorePublicAcls: true,
        restrictPublicBuckets: true,
    }),
});
`,
    },
  ],
  invalid: [
    {
      code: `
import * as s3 from '@aws-cdk/aws-s3';

new s3.Bucket(this, 'TestBucket', {
  accessControl: s3.BucketAccessControl.PUBLIC_READ_WRITE,
});
`,
      errors: [
        {
          messageId: 'noS3PublicRead',
          suggestions: [
            {
              messageId: 'bucketACLAllowsPublicRead',
              output: `
import * as s3 from '@aws-cdk/aws-s3';

new s3.Bucket(this, 'TestBucket', {
  accessControl: s3.BucketAccessControl.PRIVATE,
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
import * as s3 from '@aws-cdk/aws-s3';

new s3.Bucket(this, 'TestBucket', {
  accessControl: s3.BucketAccessControl.PUBLIC_READ,
});
`,
      errors: [
        {
          messageId: 'noS3PublicRead',
          suggestions: [
            {
              messageId: 'bucketACLAllowsPublicRead',
              output: `
import * as s3 from '@aws-cdk/aws-s3';

new s3.Bucket(this, 'TestBucket', {
  accessControl: s3.BucketAccessControl.PRIVATE,
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
import * as s3 from '@aws-cdk/aws-s3';

new s3.Bucket(this, 'TestBucket', {
  accessControl: s3.BucketAccessControl.AUTHENTICATED_READ,
});
`,
      errors: [
        {
          messageId: 'noS3PublicRead',
          suggestions: [
            {
              messageId: 'bucketACLAllowsPublicRead',
              output: `
import * as s3 from '@aws-cdk/aws-s3';

new s3.Bucket(this, 'TestBucket', {
  accessControl: s3.BucketAccessControl.PRIVATE,
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
import * as s3 from '@aws-cdk/aws-s3';

new s3.Bucket(this, 'TestBucket', {
  blockPublicAccess: new s3.BlockPublicAccess({
    blockPublicAcls: true,
    blockPublicPolicy: true,
    restrictPublicBuckets: true,
  }),
});
`,
      errors: [
        {
          messageId: 'noS3PublicRead',
          // suggestions: [
          // {
          // messageId: 'bucketShouldBePrivate',
          // output: `
          // import * as s3 from '@aws-cdk/aws-s3';

          // new s3.Bucket(this, 'TestBucket', {
          // blockPublicAccess: new s3.BlockPublicAccess({
          // blockPublicAcls: true,
          // blockPublicPolicy: true,
          // ignorePublicAcls: true,
          // restrictPublicBuckets: true,
          // }),
          // });
          // `,
          // },
          // ],
        },
      ],
      output: null,
    },
    {
      code: `
import * as s3 from '@aws-cdk/aws-s3';

new s3.Bucket(this, 'TestBucket', {
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
});
`,
      errors: [
        {
          messageId: 'noS3PublicRead',
          suggestions: [
            {
              messageId: 'bucketAllowsPublicRead',
              output: `
import * as s3 from '@aws-cdk/aws-s3';

new s3.Bucket(this, 'TestBucket', {
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
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
import * as s3 from '@aws-cdk/aws-s3';

const bucket = new s3.Bucket(this, 'TestBucket');

bucket.grantPublicAccess();
`,
      errors: [
        {
          messageId: 'noS3PublicRead',
          suggestions: [
            {
              messageId: 'bucketAllowsPublicRead',
              output: `
import * as s3 from '@aws-cdk/aws-s3';

const bucket = new s3.Bucket(this, 'TestBucket');


`,
            },
          ],
        },
      ],
      output: null,
    },
    {
      code: `
import * as s3 from '@aws-cdk/aws-s3';
import * as iam from '@aws-cdk/aws-iam';

const bucket = new s3.Bucket(this, 'TestBucket');

bucket.addToResourcePolicy(new iam.PolicyStatement({
    actions: ['s3:GetObject'],
    resources: ['*'],
    principals: ['*'],
}));
`,
      errors: [
        {
          messageId: 'noS3PublicRead',
        },
      ],
      output: null,
    },
    {
      code: `
import * as s3 from '@aws-cdk/aws-s3';
import * as iam from '@aws-cdk/aws-iam';

const bucket = new s3.Bucket(this, 'TestBucket');

const policy = new iam.PolicyStatement({
    actions: ['s3:GetObject'],
    resources: ['*'],
    principals: ['*'],
});

bucket.addToResourcePolicy(policy);
`,
      errors: [
        {
          messageId: 'noS3PublicRead',
        },
      ],
      output: null,
    },
    {
      code: `
import * as s3 from '@aws-cdk/aws-s3';
import * as iam from '@aws-cdk/aws-iam';

const bucket = new s3.Bucket(this, 'TestBucket');

const bucketPolicy = new s3.BucketPolicy(this, 'BucketPolicy', {
    bucket,
});

bucketPolicy.document.addStatements([
  new iam.PolicyStatement({
    actions: ['s3:GetObject'],
    resources: ['*'],
    principals: ['*'],
  })
]);
`,
      errors: [
        {
          messageId: 'noS3PublicRead',
        },
      ],
      output: null,
    },
    {
      code: `
import * as s3 from '@aws-cdk/aws-s3';
import * as iam from '@aws-cdk/aws-iam';

const bucket = new s3.Bucket(this, 'TestBucket');

bucket.addToResourcePolicy(new iam.PolicyStatement({
    actions: ['s3:GetObject'],
    resources: ['*'],
    principals: ['myPrincipal'],
}));

bucket.addToResourcePolicy(new iam.PolicyStatement({
    actions: ['s3:GetObject'],
    resources: ['*'],
    principals: ['*'],
}));
`,
      errors: [
        {
          messageId: 'noS3PublicRead',
        },
      ],
      output: null,
    },
    {
      code: `
import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as iam from '@aws-cdk/aws-iam';

export class NewBucket extends cdk.Stack {
  public readonly bucket: s3.IBucket;
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    this.bucket = new s3.Bucket(this, 'TestBucket');

    this.bucket.addToResourcePolicy(new iam.PolicyStatement({
        actions: ['s3:GetObject'],
        resources: ['*'],
        principals: ['myPrincipal'],
    }));

    this.bucket.addToResourcePolicy(new iam.PolicyStatement({
        actions: ['s3:GetObject'],
        resources: ['*'],
        principals: ['*'],
    }));
  }
}

`,
      errors: [
        {
          messageId: 'noS3PublicRead',
        },
      ],
      output: null,
    },
    {
      code: `
import * as s3 from '@aws-cdk/aws-s3';
import * as iam from '@aws-cdk/aws-iam';

const bucket = new s3.Bucket(this, 'TestBucket');

const policy = new iam.PolicyStatement({
    actions: ['s3:GetObject'],
    resources: ['*'],
    principals: ['*'],
});

bucket.addToResourcePolicy(policy);
`,
      errors: [
        {
          messageId: 'noS3PublicRead',
        },
      ],
      output: null,
    },
    {
      code: `
import * as s3 from '@aws-cdk/aws-s3';
import * as iam from '@aws-cdk/aws-iam';

const bucket = new s3.Bucket(this, 'TestBucket');

const bucketPolicy = new s3.BucketPolicy(this, 'BucketPolicy', {
    bucket,
});


const statements = [new iam.PolicyStatement({
  actions: ['s3:GetObject'],
  resources: ['*'],
  principals: ['*'],
})];

bucketPolicy.document.addStatements(statements)
`,
      errors: [
        {
          messageId: 'noS3PublicRead',
        },
      ],
      output: null,
    },
    {
      code: `
import * as s3 from '@aws-cdk/aws-s3';
import * as iam from '@aws-cdk/aws-iam';

const bucket = new s3.Bucket(this, 'TestBucket');

const bucketPolicy = new s3.BucketPolicy(this, 'BucketPolicy', {
    bucket,
});


const statement = new iam.PolicyStatement({
  actions: ['s3:GetObject'],
  resources: ['*'],
  principals: ['*'],
});

bucketPolicy.document.addStatements([ statement ])
`,
      errors: [
        {
          messageId: 'noS3PublicRead',
        },
      ],
      output: null,
    },
  ],
});