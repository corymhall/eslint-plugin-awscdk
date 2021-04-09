import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils';
import * as util from '../util';

const createRule = ESLintUtils.RuleCreator(
  name => `${name}`,
);

type Options = [];
type MessageIds =
    | 'missingEncryption'

export default createRule<Options, MessageIds>({
  meta: {
    type: 'suggestion',
    schema: [],
    messages: {
      missingEncryption: 'Encryption should be enabled for all SNS Topic',
    },
    docs: {
      category: 'Best Practices',
      description: 'SNS Topics should be encrypted at rest using AWS KMS',
      recommended: 'warn',
      extendsBaseRule: false,
    },
  },
  name: 'require-sns-topic-encryption',
  defaultOptions: [],
  create: context => {
    return {
      NewExpression(node: TSESTree.NewExpression) {
        const cdkObject = util.getCdkExpression({
          construct: 'Topic',
          library: 'sns',
          node: node,
          propertyKey: 'masterKey',
        });
        if (!cdkObject) {
          return;
        }
        if (!cdkObject.propertyValue) {
          context.report({
            node,
            messageId: 'missingEncryption',
          });
        } else {
          return;
        }
        return;
      },
    };
  },
});