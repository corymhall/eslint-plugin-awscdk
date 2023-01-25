import { ESLintUtils, TSESTree, TSESLint } from '@typescript-eslint/utils';
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
      suggestion: true,
      description: 'KMS Keys should not be scheduled for deletion',
      recommended: 'warn',
    },
    fixable: 'code',
    hasSuggestions: true,
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
                  const fixes: TSESLint.RuleFix[] = [
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

