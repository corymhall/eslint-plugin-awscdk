export = {
  rules: {
    'awscdk/require-dynamodb-ptr': 'error',
    'awscdk/require-sns-topic-encryption': 'error',
    'awscdk/require-bucket-encryption': 'error',
    'awscdk/no-iam-admin-permissions': 'error',
    'awscdk/require-bucket-ssl': 'error',
    'awscdk/require-dynamodb-autoscale': 'error',
    'awscdk/no-rds-public-access': 'error',
    'awscdk/no-kms-key-delete': 'error',
    'awscdk/no-s3-public-write': 'error',
    'awscdk/no-s3-public-read': 'error',
    'awscdk/require-cloudfront-default-root-object': 'error',
    'awscdk/no-redshift-public-access': 'error',
  },
};
