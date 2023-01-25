import * as path from 'path';
import { TSESLint } from '@typescript-eslint/utils';
import rule from '../src/rules/no-rds-public-access';

// let linter: ESLint;
const ruleTester = new TSESLint.RuleTester({
  parser: path.resolve('./node_modules/@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
});

ruleTester.run('no-rds-public-access', rule, {
  valid: [
    {
      code: `
import * as rds from '@aws-cdk/aws-rds';

new rds.DatabaseInstance(this, 'Instance', {
  publiclyAccessible: false,
});
`,
    },
    {
      code: `
import * as rds from '@aws-cdk/aws-rds';

new rds.DatabaseInstance(this, 'Instance', {
  vpcSubnets: {
    subnetType: ec2.SubnetType.PRIVATE,
  }
});
`,
    },
  ],
  invalid: [
    {
      code: `
import * as rds from '@aws-cdk/aws-rds';

new rds.DatabaseInstance(this, 'Instance', {
  vpcSubnets: {
    subnetType: ec2.SubnetType.PUBLIC,
  }
});
`,
      errors: [
        {
          messageId: 'noRDSPublicAccess',
          suggestions: [
            {
              messageId: 'rdsPrivateSubnets',
              output: `
import * as rds from '@aws-cdk/aws-rds';

new rds.DatabaseInstance(this, 'Instance', {
  vpcSubnets: {
    subnetType: ec2.SubnetType.PRIVATE,
  }
});
`,
            },
            {
              messageId: 'rdsIsolatedSubnets',
              output: `
import * as rds from '@aws-cdk/aws-rds';

new rds.DatabaseInstance(this, 'Instance', {
  vpcSubnets: {
    subnetType: ec2.SubnetType.ISOLATED,
  }
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
import { DatabaseInstance } from '@aws-cdk/aws-rds';
import { SubnetType } from '@aws-cdk/aws-ec2';

new DatabaseInstance(this, 'Instance', {
  vpcSubnets: {
    subnetType: SubnetType.PUBLIC,
  }
});
`,
      errors: [
        {
          messageId: 'noRDSPublicAccess',
          suggestions: [
            {
              messageId: 'rdsPrivateSubnets',
              output: `
import { DatabaseInstance } from '@aws-cdk/aws-rds';
import { SubnetType } from '@aws-cdk/aws-ec2';

new DatabaseInstance(this, 'Instance', {
  vpcSubnets: {
    subnetType: SubnetType.PRIVATE,
  }
});
`,
            },
            {
              messageId: 'rdsIsolatedSubnets',
              output: `
import { DatabaseInstance } from '@aws-cdk/aws-rds';
import { SubnetType } from '@aws-cdk/aws-ec2';

new DatabaseInstance(this, 'Instance', {
  vpcSubnets: {
    subnetType: SubnetType.ISOLATED,
  }
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
import * as rds from '@aws-cdk/aws-rds';

new rds.DatabaseInstance(this, 'Instance', {
  publiclyAccessible: true,
});
`,
      errors: [
        {
          messageId: 'noRDSPublicAccess',
          suggestions: [
            {
              messageId: 'noRDSPublicAccess',
              output: `
import * as rds from '@aws-cdk/aws-rds';

new rds.DatabaseInstance(this, 'Instance', {
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
