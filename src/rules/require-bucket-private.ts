import { ESLintUtils, TSESTree, TSESLint } from '@typescript-eslint/utils';
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
      suggestion: true,
      description: 'Buckets should not be public',
      recommended: 'warn',
      extendsBaseRule: false,
    },
    fixable: 'code',
    hasSuggestions: true,
  },
  name: 'require-bucket-private',
  defaultOptions: [],
  create: context => {
    return {
      NewExpression(node: TSESTree.NewExpression) {
        const cdkObject = util.getCdkExpression({
          construct: 'Bucket',
          library: 's3',
          node: node,
          propertyKey: 'publicReadAccess',
        });
        if (cdkObject?.propertyValue === true) {
          context.report({
            node,
            messageId: 'publicBucket',
            loc: cdkObject.propertyLoc,
            suggest: [
              {
                messageId: 'bucketShouldBePrivate',
                fix: (fixer: TSESLint.RuleFixer) => {
                  const fixes: TSESLint.RuleFix[] = [
                    fixer.replaceTextRange(cdkObject.propertyRange!, 'false'),
                  ];
                  return fixes;
                },

              },
            ],
          });
        } else {
          return;
        }
        return;
      },
    };
  },
});

