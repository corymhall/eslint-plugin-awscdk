export = {
  extends: ['./configs/aws-foundational'],
  rules: {
    'cdk-security/require-bucket-private': 'error',
    'cdk-security/no-public-ingress': 'error',
    'cdk-security/no-iam-star-actions': 'error',
  },
};