import * as path from 'path';
import { TSESLint } from '@typescript-eslint/experimental-utils';
import rule from '../src/rules/no-s3-public-write';

// let linter: ESLint;
const ruleTester = new TSESLint.RuleTester({
  parser: path.resolve('./node_modules/@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
});

ruleTester.run('no-s3-public-write', rule, {
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
          messageId: 'publicBucket',
          suggestions: [
            {
              messageId: 'bucketShouldBePrivate',
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
          messageId: 'publicBucket',
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
          messageId: 'publicBucket',
          suggestions: [
            {
              messageId: 'bucketShouldBePrivate',
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
          messageId: 'publicBucket',
          suggestions: [
            {
              messageId: 'bucketShouldBePrivate',
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

const bucket = new s3.Bucket(this, 'TestBucket');

bucket.addToResourcePolicy(new iam.PolicyStatement({
    actions: ['s3:GetObject'],
    resources: ['*'],
    pricinpals: ['*'],
}));
`,
      errors: [
        {
          messageId: 'publicBucket',
        },
      ],
      output: null,
    },
    {
      code: `
import * as s3 from '@aws-cdk/aws-s3';

const bucket = new s3.Bucket(this, 'TestBucket');

const bucketPolicy = new s3.BucketPolicy(this, 'BucketPolicy', {
    bucket,
});

bucketPolicy.document.addStatements([
  new iam.PolicyStatement({
    actions: ['s3:GetObject'],
    resources: ['*'],
    pricinpals: ['*'],
  })
]);
`,
      errors: [
        {
          messageId: 'publicBucket',
        },
      ],
      output: null,
    },
  ],
});