import * as path from 'path';
import { TSESLint } from '@typescript-eslint/utils';
import rule from '../src/rules/require-dynamodb-autoscale';

// let linter: ESLint;
const ruleTester = new TSESLint.RuleTester({
  parser: path.resolve('./node_modules/@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
});

ruleTester.run('require-dynamodb-autoscale', rule, {
  valid: [
    {
      code: `
import * as cdk from 'monocdk';
import * as dynamodb from 'monocdk/aws-dynamodb';
import * as kms from 'monocdk/aws-kms';

const key = new kms.Key(this, 'Key');

const table = new dynamodb.Table(this, 'Table', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
});

table.autoScaleReadCapacity({
  maxCapacity: 10,
  minCapacity: 1,
});

table.autoScaleWriteCapacity({
  maxCapacity: 10,
  minCapacity: 1,
});
`,
    },
    {
      code: `
import * as cdk from 'monocdk';
import * as dynamodb from 'monocdk/aws-dynamodb';

const table = new dynamodb.Table(this, 'Table', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
  replicationRegions: ['us-east-1', 'us-east-2'],
});
`,
    },
    {
      code: `
import * as cdk from 'monocdk';
import * as dynamodb from 'monocdk/aws-dynamodb';

const table = new dynamodb.Table(this, 'Table', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
  billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
});
`,
    },
    {
      code: `
import * as cdk from 'monocdk';
import * as dynamodb from 'monocdk/aws-dynamodb';
import * as kms from 'monocdk/aws-kms';

export class MyConstruct extends cdk.Construct {
  public readonly table: dynamodb.ITable;
  
  constructor(scope: cdk.Construct, id: string, props: MyProps) {
    super(scope, id, props);

    const key = new kms.Key(this, 'Key');

    this.table = new dynamodb.Table(this, 'Table', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
    });

    this.table.autoScaleReadCapacity({
      maxCapacity: 10,
      minCapacity: 1,
    });

    this.table.autoScaleWriteCapacity({
      maxCapacity: 10,
      minCapacity: 1,
    });
  }
}
`,
    },
    {
      code: `
import * as cdk from 'monocdk';
import { Table, ITable } from 'monocdk/aws-dynamodb';
import * as kms from 'monocdk/aws-kms';

export class MyConstruct extends cdk.Construct {
  public readonly table: ITable;
  
  constructor(scope: cdk.Construct, id: string, props: MyProps) {
    super(scope, id, props);

    const key = new kms.Key(this, 'Key');

    this.table = new Table(this, 'Table', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
    });

    this.table.autoScaleReadCapacity({
      maxCapacity: 10,
      minCapacity: 1,
    });

    this.table.autoScaleWriteCapacity({
      maxCapacity: 10,
      minCapacity: 1,
    });
  }
}
`,
    },
  ],
  invalid: [
    {
      code: `
import * as cdk from 'monocdk';
import * as dynamodb from 'monocdk/aws-dynamodb';
import * as kms from 'monocdk/aws-kms';

const key = new kms.Key(this, 'Key');

const table = new dynamodb.Table(this, 'Table', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
});
`,
      errors: [
        {
          messageId: 'requireDynamoDBAutoScaling',
        },
      ],
      output: null,
    },
    {
      code: `
import * as cdk from 'monocdk';
import * as dynamodb from 'monocdk/aws-dynamodb';
import * as kms from 'monocdk/aws-kms';

const key = new kms.Key(this, 'Key');

new dynamodb.Table(this, 'Table', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
});
`,
      errors: [
        {
          messageId: 'requireDynamoDBAutoScaling',
        },
      ],
      output: null,
    },
    {
      code: `
import * as cdk from 'monocdk';
import * as dynamodb from 'monocdk/aws-dynamodb';
import * as kms from 'monocdk/aws-kms';

const key = new kms.Key(this, 'Key');

new dynamodb.Table(this, 'Table', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
  billingMode: dynamodb.BillingMode.PROVISIONED,
});
`,
      errors: [
        {
          messageId: 'requireDynamoDBAutoScaling',
        },
      ],
      output: null,
    },
  ],
});
