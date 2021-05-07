import { ESLintUtils, TSESTree, TSESLint } from '@typescript-eslint/experimental-utils';
import { Rule } from 'eslint';
import * as util from '../util';

const createRule = ESLintUtils.RuleCreator(
  name => `${name}`,
);


type Options = [];
type MessageIds =
    | 'kmsKeyDoNotDelete'


export default createRule<Options, MessageIds>({
  meta: {
    type: 'suggestion',
    schema: [],
    messages: {
      kmsKeyDoNotDelete: 'KMS Keys should not be scheduled for deletion',
    },
    docs: {
      category: 'Best Practices',
      description: 'KMS Keys should not be scheduled for deletion',
      recommended: 'warn',
    },
    fixable: 'code',
  },
  name: 'no-kms-key-delete',
  defaultOptions: [],
  create: context => {
    return {
      NewExpression(node: TSESTree.NewExpression) {
        const cdkObject = util.getCdkExpression({
          construct: 'Key',
          library: 'kms',
          node: node,
          propertyKey: 'removalPolicy',
        });
        if (cdkObject?.propertyValue === 'DESTROY') {
          context.report({
            node,
            messageId: 'kmsKeyDoNotDelete',
            loc: cdkObject.propertyLoc,
            suggest: [
              {
                messageId: 'kmsKeyDoNotDelete',
                fix: (fixer: TSESLint.RuleFixer) => {
                  const fixes: Rule.Fix[] = [
                    fixer.replaceTextRange(cdkObject.propertyRange!, 'RETAIN'),
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

