import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils';
import * as util from '../util';

const createRule = ESLintUtils.RuleCreator(
  name => `${name}`,
);


type Options = [];
type MessageIds =
    | 'requireCloudFrontDefaultRootObject'


export default createRule<Options, MessageIds>({
  meta: {
    type: 'suggestion',
    schema: [],
    messages: {
      requireCloudFrontDefaultRootObject: 'CloudFront distributions should have defaultRootObject configured.',
    },
    docs: {
      category: 'Best Practices',
      description: 'This control checks whether an Amazon CloudFront distribution is configured to return a specific object that is the default root object.',
      recommended: 'warn',
    },
  },
  name: 'require-cloudfront-default-root-object',
  defaultOptions: [],
  create: context => {
    return {
      NewExpression(node: TSESTree.NewExpression) {
        const cdkObject = util.getCdkExpression({
          construct: 'Distribution',
          library: 'cloudfront',
          node: node,
          propertyKey: 'defaultRootObject',
        });
        if (cdkObject && cdkObject.propertyValue === undefined) {
          context.report({
            node,
            messageId: 'requireCloudFrontDefaultRootObject',
            loc: cdkObject.propertyLoc,
          });
        } else {
          return;
        }
        return;
      },
    };
  },
});