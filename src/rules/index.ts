import noIamStarActions from './no-iam-star-actions';
import noPublicIngress from './no-public-ingress';
import requireBucketEncryption from './require-bucket-encryption';
import requireBucketPrivate from './require-bucket-private';

export default {
  'require-bucket-encryption': requireBucketEncryption,
  'require-bucket-private': requireBucketPrivate,
  'no-public-ingress': noPublicIngress,
  'no-iam-star-actions': noIamStarActions,
};