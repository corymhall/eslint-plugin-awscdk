import * as path from 'path';
import { TSESLint } from '@typescript-eslint/experimental-utils';
import rule from '../src/rules/no-redshift-public-access';

// let linter: ESLint;
const ruleTester = new TSESLint.RuleTester({
  parser: path.resolve('./node_modules/@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
});

ruleTester.run('no-redshift-public-access', rule, {
  valid: [
    {
      code: `
import * as redshift from '@aws-cdk/aws-redshift';

new redshift.Cluster(this, 'Instance', {
  publiclyAccessible: false,
});
`,
    },
  ],
  invalid: [
    {
      code: `
import * as redshift from '@aws-cdk/aws-redshift';

new redshift.Cluster(this, 'Instance', {
  publiclyAccessible: true,
});
`,
      errors: [
        {
          messageId: 'noRedshiftPublicAccess',
          suggestions: [
            {
              messageId: 'noRedshiftPublicAccess',
              output: `
import * as redshift from '@aws-cdk/aws-redshift';

new redshift.Cluster(this, 'Instance', {
  publiclyAccessible: false,
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