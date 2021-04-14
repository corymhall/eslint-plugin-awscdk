import noIamAdminPermissions from './no-iam-admin-permissions';
import noIamStarActions from './no-iam-star-actions';
import noPolicyAllowKmsDecrypt from './no-policy-allow-kms-decrypt';
import noPublicIngress from './no-public-ingress';
import requireBucketEncryption from './require-bucket-encryption';
import requireBucketPrivate from './require-bucket-private';
import requireBucketSSL from './require-bucket-ssl';
import requireDynamoDBAutoScaling from './require-dynamodb-autoscale';
import requireDynamodbPTR from './require-dynamodb-ptr';
import requireSNSTopicEncryption from './require-sns-topic-encryption';

export default {
  'require-bucket-encryption': requireBucketEncryption,
  'require-bucket-private': requireBucketPrivate,
  'no-public-ingress': noPublicIngress,
  'no-iam-star-actions': noIamStarActions,
  'no-iam-admin-permissions': noIamAdminPermissions,
  'no-policy-allow-kms-decrypt': noPolicyAllowKmsDecrypt,
  'require-bucket-ssl': requireBucketSSL,
  'require-dynamodb-ptr': requireDynamodbPTR,
  'require-sns-topic-encryption': requireSNSTopicEncryption,
  'require-dynamodb-autoscale': requireDynamoDBAutoScaling,
};