import all from './configs/all';
import aws_foundational from './configs/aws-foundational';
import rules from './rules';

export = {
  rules,
  configs: {
    all,
    'aws-foundational': aws_foundational,
  },
};