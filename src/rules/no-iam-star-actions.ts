import { AST_NODE_TYPES, ESLintUtils, TSESTree } from '@typescript-eslint/utils';
// import { Rule } from 'eslint';
import * as util from '../util';

const createRule = ESLintUtils.RuleCreator(
  name => `${name}`,
);


type Options = [];
type MessageIds =
    | 'noIamStarActions'


export default createRule<Options, MessageIds>({
  meta: {
    type: 'suggestion',
    schema: [],
    messages: {
      noIamStarActions: 'Using "*" actions can be dangerous',
    },
    docs: {
      requiresTypeChecking: true,
      description: 'Buckets should not be public',
      recommended: 'warn',
      extendsBaseRule: false,
    },
  },
  name: 'require-bucket-private',
  defaultOptions: [],
  create: context => {
    return {
      NewExpression(node: TSESTree.NewExpression) {
        const cdkObject = util.getCdkExpression({
          construct: 'PolicyStatement',
          library: 'iam',
          node: node,
          propertyKey: 'actions',
        });
        for (let i = 0; i < cdkObject?.propertyValue.length; i++) {
          const prop = cdkObject?.propertyValue[i] as TSESTree.Node;
          if (prop.type === AST_NODE_TYPES.Literal) {
            if (typeof prop.value === 'string' && prop.value.includes('*')) {
              context.report({
                node,
                messageId: 'noIamStarActions',
                loc: prop.loc,
              });
            }
          }
        }
        return;
      },
    };
  },
});

