export = {
  extends: ['./configs/aws-foundational'],
  rules: {
    'awscdk/require-bucket-private': 'error',
    'awscdk/no-public-ingress': 'error',
    'awscdk/no-iam-star-actions': 'error',
  },
};
