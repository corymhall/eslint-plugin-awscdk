import * as path from 'path';
import { TSESLint } from '@typescript-eslint/experimental-utils';
import rule from '../src/rules/require-cloudfront-default-root-object';

// let linter: ESLint;
const ruleTester = new TSESLint.RuleTester({
  parser: path.resolve('./node_modules/@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
});

ruleTester.run('require-cloudfront-default-root-object', rule, {
  valid: [
    {
      code: `
import * as cloudfront from '@aws-cdk/aws-cloudfront';

new cloudfront.Distribution(this, 'Distro', {
    defaultBehavior: { origin: new origins.S3Origin(myBucket) },
    defaultRootObject: 'index.html',
});
`,
    },
    {
      code: `
import { Distribution } from '@aws-cdk/aws-cloudfront';

new Distribution(this, 'Distro', {
    defaultBehavior: { origin: new origins.S3Origin(myBucket) },
    defaultRootObject: 'index.html',
});
`,
    },
  ],
  invalid: [
    {
      code: `
import * as cloudfront from '@aws-cdk/aws-cloudfront';

new cloudfront.Distribution(this, 'Distro', {
    defaultBehavior: { origin: new origins.S3Origin(myBucket) },
});
`,
      errors: [
        {
          messageId: 'requireCloudFrontDefaultRootObject',
        },
      ],
      output: null,
    },
  ],
});