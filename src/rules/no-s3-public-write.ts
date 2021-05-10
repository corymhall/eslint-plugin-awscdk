import { ESLintUtils, TSESTree, TSESLint, AST_NODE_TYPES } from '@typescript-eslint/experimental-utils';
import { Rule } from 'eslint';
import * as util from '../util';

const createRule = ESLintUtils.RuleCreator(
  name => `${name}`,
);


type Options = [];
type MessageIds =
    | 'publicBucket'
    | 'bucketShouldBePrivate'


export default createRule<Options, MessageIds>({
  meta: {
    type: 'suggestion',
    schema: [],
    messages: {
      publicBucket: 'S3 Buckets should not be public',
      bucketShouldBePrivate: 'Restrict all public access to the bucket',
    },
    docs: {
      requiresTypeChecking: true,
      category: 'Best Practices',
      description: 'Buckets should not be public',
      recommended: 'warn',
      extendsBaseRule: false,
    },
    fixable: 'code',
  },
  name: 'no-s3-public-write',
  defaultOptions: [],
  create: context => {
    return {
      NewExpression(node: TSESTree.NewExpression) {
        const cdkObject = util.getCdkExpression({
          construct: 'Bucket',
          library: 's3',
          node: node,
          propertyKey: 'accessControl',
        });
        if (cdkObject?.propertyValue === 'PUBLIC_READ_WRITE') {
          context.report({
            node,
            messageId: 'publicBucket',
            loc: cdkObject.propertyLoc,
            suggest: [
              {
                messageId: 'bucketShouldBePrivate',
                fix: (fixer: TSESLint.RuleFixer) => {
                  const fixes: Rule.Fix[] = [
                    fixer.replaceTextRange(cdkObject.propertyRange!, 'PRIVATE'),
                  ];
                  return fixes;
                },

              },
            ],
          });
        }
        const cdkObject2 = util.getCdkExpression({
          construct: 'Bucket',
          library: 's3',
          node: node,
          propertyKey: 'blockPublicAccess',
        });
        if (cdkObject2?.propertyValue === 'BLOCK_ACLS') {
          context.report({
            node,
            messageId: 'publicBucket',
            loc: cdkObject2.propertyLoc,
            suggest: [
              {
                messageId: 'bucketShouldBePrivate',
                fix: (fixer: TSESLint.RuleFixer) => {
                  const fixes: Rule.Fix[] = [
                    fixer.replaceTextRange(cdkObject2.propertyRange!, 'BLOCK_ALL'),
                  ];
                  return fixes;
                },

              },
            ],
          });
        } else if (cdkObject2?.propertyValue?.type === AST_NODE_TYPES.NewExpression) {
          const properties: {[key: string]: string} = {};
          cdkObject2.propertyValue.arguments.forEach((arg: TSESTree.ObjectExpression) => {
            arg.properties.forEach(props => {
              if (props.type === AST_NODE_TYPES.Property) {
                const key = props.key as TSESTree.Identifier;
                const value = props.value as TSESTree.Literal;
                properties[key.name] = value.raw;
              }
            });
          });
          if (Object.keys(properties).length != 4) {
            context.report({
              node,
              messageId: 'publicBucket',
              loc: cdkObject2.propertyLoc,
            });
          } else if (Object.values(properties).includes('false')) {
            context.report({
              node,
              messageId: 'publicBucket',
              loc: cdkObject2.propertyLoc,
            });
          }
        } else {
          return;
        }
        return;
      },
    };
  },
});

