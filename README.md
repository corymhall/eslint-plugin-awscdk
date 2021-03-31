# replace this


## AWS Foundational Security Best Practices

[APIGateway.1 API Gateway REST and HTTP API logging should be enabled]()

```typescript

```

- [CloudFront.1 CloudFront distributions should have a default root object configured](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-cloudfront-1)

- [CloudFront.2 CloudFront distributions should have origin access identity enabled](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-cloudfront-2)

- [CloudFront.3 CloudFront distributions should require encryption in transit](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-cloudfront-3)

- [CloudFront.4 CloudFront distributions should have origin failover configured](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-cloudfront-4)

- [DMS.1 Database Migration Service replication instances should not be public](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-dms-1)

- [DynamoDB.1 DynamoDB tables should automatically scale capacity with demand](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-dynamodb-1)

- [DynamoDB.2 DynamoDB tables should have point-in-time recovery enabled](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-dynamodb-2)

- [DynamoDB.3 DynamoDB Accelerator (DAX) clusters should be encrypted at rest](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-dynamodb-3)

- [EC2.3 Attached EBS volumes should be encrypted at-rest](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-ec2-3)

- [EFS.1 Amazon EFS should be configured to encrypt file data at rest using AWS KMS](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-efs-1)

- [ELB.4 Application load balancers should be configured to drop HTTP headers](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-elb-4)

- [ELB.5 Application and Classic Load Balancers logging should be enabled](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-elb-5)

- [ELB.6 Application Load Balancer deletion protection should be enabled](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-elb-6)

- [ELBv2.1 Application Load Balancer should be configured to redirect all HTTP requests to HTTPS](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-elbv2-1)

- [EMR.1 Amazon EMR cluster master nodes should not have public IP addresses](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-emr-1)

- [ES.1 Elasticsearch domains should have encryption at-rest enabled](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-es-1)

- [ES.2 Amazon Elasticsearch Service domains should be in a VPC](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-es-2)

- [ES.3 Amazon Elasticsearch Service domains should encrypt data sent between nodes](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-es-3)

- [IAM.1 IAM policies should not allow full "*" administrative privileges](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-iam-1)

```ts
new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  resources: ['*'],
  actions: ['*'],
});
```

- [IAM.2 IAM users should not have IAM policies attached](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-iam-2)

- [KMS.1 IAM customer managed policies should not allow decryption actions on all KMS keys](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-kms-1)

```ts
import * as iam from '@aws-cdk/aws-iam';
new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  resources: ['*'],
  actions: ['kms:Decrypt', 'kms:ReEncryptFrom'],
});
```

- [KMS.2 IAM principals should not have IAM inline policies that allow decryption actions on all KMS keys](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-kms-2)

```ts
import * as iam from '@aws-cdk/aws-iam';
new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  resources: ['*'],
  actions: ['kms:Decrypt', 'kms:ReEncryptFrom'],
});
```

- [KMS.3 AWS KMS keys should not be unintentionally deleted](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-kms-3)

```ts
new kms.Key(this, 'Key', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
})
```

- [Lambda.1 Lambda function policies should prohibit public access](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-lambda-1)

- [Lambda.2 Lambda functions should use latest runtimes](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-lambda-2)

- [RDS.2 RDS DB instances should prohibit public access, determined by the PubliclyAccessible configuration](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-rds-2)

```ts
new rds.DatabaseInstance(this, 'Instance', {
  ...
  publiclyAccessible: true,
});
```

__default value of 'publiclyAccessible' is determined by the subnet type__
```ts
new rds.DatabaseInstance(this, 'Instance', {
  ...
  vpcSubnets: {
    subnetType: ec2.SubnetType.PUBLIC,
  }
});
```

- [RDS.3 RDS DB instances should have encryption at rest enabled](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-rds-3)

```ts
new rds.DatabaseInstance(this, 'Instance', {
  ...
  storageEncrypted: false,
})
```

- [RDS.4 RDS cluster snapshots and database snapshots should be encrypted at rest](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-rds-4)

- [RDS.5 RDS DB instances should be configured with multiple Availability Zones](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-rds-5)

- [RDS.6 Enhanced monitoring should be configured for RDS DB instances and clusters](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-rds-6)

*How to enable*
```ts
new rds.DatabaseInstance(this, 'Instance', {
  ...
  enablePerformanceInsights: true,
})
```

*or*
```ts
new rds.DatabaseInstance(this, 'Instance', {
  ...
  performanceInsightsEncryptionKey: key,
})
```

*or*
```ts
new rds.DatabaseInstance(this, 'Instance', {
  ...
  performanceInsightsRetention: rds.PerformanceInsightsRetention.DEFAULT,
})
```

- [RDS.7 RDS clusters should have deletion protection enabled](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-rds-7)


```ts
new rds.DatabaseCluster(this, 'Instance', {
  ...
  deletionProtection: false,
})
```

*How to enable*
```ts
new rds.DatabaseCluster(this, 'Instance', {
  ...
  deletionProtection: true,
})
```

*or*
```ts
new rds.DatabaseCluster(this, 'Instance', {
  ...
  removalPolicy: cdk.RemovalPolicy.RETAIN,
})
```


- [RDS.8 RDS DB instances should have deletion protection enabled](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-rds-8)

```ts
new rds.DatabaseInstance(this, 'Instance', {
  ...
  deletionProtection: false,
})
```

*How to enable*
```ts
new rds.DatabaseInstance(this, 'Instance', {
  ...
  deletionProtection: true,
})
```

*or*
```ts
new rds.DatabaseInstance(this, 'Instance', {
  ...
  removalPolicy: cdk.RemovalPolicy.RETAIN,
})
```

- [RDS.9 Database logging should be enabled](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-rds-9)

- [RDS.10 IAM authentication should be configured for RDS instances](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-rds-10)

- [Redshift.1 Amazon Redshift clusters should prohibit public access](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-redshift-1)

- [Redshift.2 Connections to Amazon Redshift clusters should be encrypted in transit](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-redshift-2)

- [Redshift.3 Amazon Redshift clusters should have automatic snapshots enabled](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-redshift-3)

- [Redshift.6 Amazon Redshift should have automatic upgrades to major versions enabled](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-redshift-6)

- [S3.1 S3 Block Public Access setting should be enabled](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-s3-1)

- [S3.2 S3 buckets should prohibit public read access](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-s3-2)

*Through Bucket ACL*
```ts
new s3.Bucket(this, 'Bucket', {
  accessControl: s3.BucketAccessControl.PUBLIC_READ,
});

// or

new s3.Bucket(this, 'Bucket', {
  accessControl: s3.BucketAccessControl.PUBLIC_READ_WRITE,
});

// or

const bucket = new s3.Bucket(this, 'Bucket', {
  accessControl: s3.BucketAccessControl.AUTHENTICATED_READ,
});



b.grantReadAccess()
bucket.grantReadAccess();
```

- [S3.3 S3 buckets should prohibit public write access](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-s3-3)

*Through Bucket ACL*
```ts
new s3.Bucket(this, 'Bucket', {
  accessControl: s3.BucketAccessControl.PUBLIC_READ_WRITE,
});
```

- [S3.4 S3 buckets should have server-side encryption enabled](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-s3-4)

- [S3.5 S3 buckets should require requests to use Secure Socket Layer](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-s3-5)

*How to enable*
```ts
new s3.Bucket(this, 'Bucket', {
  enforceSSL: true,
})
```

- [S3.6 Amazon S3 permissions granted to other AWS accounts in bucket policies should be restricted](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-s3-6)

- [SageMaker.1 SageMaker notebook instances should not have direct internet access](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-sagemaker-1)

- [SecretsManager.1 Secrets Manager secrets should have automatic rotation enabled](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-secretsmanager-1)

- [SNS.1 SNS topics should be encrypted at rest using AWS KMS](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-sns-1)

- 

## CIS AWS Foundations Benchmark

- [Ensure rotation for customer-created CMKs is enabled](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-cis-controls.html#securityhub-cis-controls-2.8)

```typescript
import * as kms from '@aws-cdk/aws-kms';

new kms.Key(this, 'MyKey', {
    enableKeyRotation: true
});
```

- [Ensure VPC flow logging is enabled in all VPCs](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-cis-controls.html#securityhub-cis-controls-2.9)

```ts
import * as ec2 from '@aws-cdk/aws-ec2';

new ec2.Vpc(this, 'Vpc', {
    flowLogs: {
        'my-vpc-flowlog': {
            destination: ec2.FlowLogDestination.toCloudWatchLogs(),
            trafficType: ec2.FlowLogTrafficType.REJECT,
        }
    }
});
```

or 

```ts
import * as ec2 from '@aws-cdk/aws-ec2';

const vpc = new ec2.Vpc(this, 'Vpc', {
    flowLogs: {
        'my-vpc-flowlog': {
            destination: ec2.FlowLogDestination.toCloudWatchLogs(),
            trafficType: ec2.FlowLogTrafficType.REJECT,
        }
    }
});

vpc.addFlowLog('my-vpc-flowlog', {
    destination: ec2.FlowLogDestination.toCloudWatchLogs(),
    trafficType: ec2.FlowLogTrafficType.REJECT,
});
```

- [Ensure no security groups allow ingress from 0.0.0.0/0 to port 22](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-cis-controls.html#securityhub-cis-controls-4.1)

- [Ensure no security groups allow ingress from 0.0.0.0/0 to port 3389](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-cis-controls.html#securityhub-cis-controls-4.2)



## 