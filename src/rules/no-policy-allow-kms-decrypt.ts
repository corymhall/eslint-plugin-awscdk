import { AST_NODE_TYPES, ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils';
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
      category: 'Best Practices',
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
        const cdkActionObject = util.getCdkExpression({
          construct: 'PolicyStatement',
          library: 'iam',
          node: node,
          propertyKey: 'actions',
        });
        const cdkResourceObject = util.getCdkExpression({
          construct: 'PolicyStatement',
          library: 'iam',
          node: node,
          propertyKey: 'resources',
        });
        const cdkEffectObject = util.getCdkExpression({
          construct: 'PolicyStatement',
          library: 'iam',
          node: node,
          propertyKey: 'effect',
        });

        let hasStarResource = false;
        let hasStarAction = false;
        let hasAllow = false;

        if (!cdkEffectObject?.propertyValue || cdkEffectObject.propertyValue === 'ALLOW') {
          hasAllow = true;
        }

        for (let i = 0; i < cdkResourceObject?.propertyValue.length; i++) {
          const prop = cdkResourceObject?.propertyValue[i] as TSESTree.Node;
          if (prop.type === AST_NODE_TYPES.Literal) {
            if (typeof prop.value === 'string' && prop.value.includes('*')) {
              hasStarResource = true;
            }
          }
        }

        for (let i = 0; i < cdkActionObject?.propertyValue.length; i++) {
          const prop = cdkActionObject?.propertyValue[i] as TSESTree.Node;
          if (prop.type === AST_NODE_TYPES.Literal) {
            if (typeof prop.value === 'string' && (prop.value.includes('kms:Decrypt') || prop.value.includes('kms:ReEncryptFrom') || prop.value.includes('kms:*'))) {
              hasStarAction = true;
            }
          }
        }

        if (hasAllow && hasStarAction && hasStarResource) {
          const loc = cdkActionObject?.objectExpression as TSESTree.ObjectExpression;
          context.report({
            node,
            messageId: 'noIamStarActions',
            loc: loc.loc,
          });
        }
        return;
      },
    };
  },
});

