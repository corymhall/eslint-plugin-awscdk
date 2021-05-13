export = {
  rules: {
    'cdk-security/require-dynamodb-ptr': 'error',
    'cdk-security/require-sns-topic-encryption': 'error',
    'cdk-security/require-bucket-encryption': 'error',
    'cdk-security/no-iam-admin-permissions': 'error',
    'cdk-security/require-bucket-ssl': 'error',
    'cdk-security/require-dynamodb-autoscale': 'error',
    'cdk-security/no-rds-public-access': 'error',
    'cdk-security/no-kms-key-delete': 'error',
    'cdk-security/no-s3-public-write': 'error',
    'cdk-security/no-s3-public-read': 'error',
  },
};