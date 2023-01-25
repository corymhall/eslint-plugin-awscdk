import { ESLintUtils, TSESTree, TSESLint } from '@typescript-eslint/utils';
import * as util from '../util';

const createRule = ESLintUtils.RuleCreator(
  name => `${name}`,
);

type Options = [];
type MessageIds =
    | 'missingPointInTimeRecovery'

export default createRule<Options, MessageIds>({
  meta: {
    type: 'suggestion',
    schema: [],
    messages: {
      missingPointInTimeRecovery: 'DynamoDB tables should have point-in-time recovery enabled',
    },
    docs: {
      suggestion: true,
      description: 'DynamoDB tables should have point-in-time recovery enabled.',
      recommended: 'warn',
      extendsBaseRule: false,
    },
    hasSuggestions: true,
    fixable: 'code',
  },
  name: 'require-bucket-ptr',
  defaultOptions: [],
  create: context => {
    return {
      NewExpression(node: TSESTree.NewExpression) {
        const spaces = ' '.repeat(node.loc.start.column + 2);
        let objectRange: TSESTree.Range;
        const cdkObject = util.getCdkExpression({
          construct: 'Table',
          library: 'dynamodb',
          node: node,
          propertyKey: 'pointInTimeRecovery',
        });
        if (cdkObject && cdkObject?.propertyValue === undefined) {
          objectRange = cdkObject?.objectExpression.range;
          context.report({
            node,
            messageId: 'missingPointInTimeRecovery',
            suggest: [
              {
                messageId: 'missingPointInTimeRecovery',
                fix: (fixer: TSESLint.RuleFixer) => {
                  const fixes: TSESLint.RuleFix[] = [
                    fixer.insertTextBeforeRange([objectRange[1]-1, objectRange[1]], `${spaces}pointInTimeRecovery: true,\n`),
                  ];
                  return fixes;
                },

              },
            ],
          });
        } else if (cdkObject?.propertyValue === false) {
          context.report({
            node,
            messageId: 'missingPointInTimeRecovery',
            loc: cdkObject.propertyLoc,
            suggest: [
              {
                messageId: 'missingPointInTimeRecovery',
                fix: (fixer: TSESLint.RuleFixer) => {
                  const fixes: TSESLint.RuleFix[] = [
                    fixer.replaceTextRange(cdkObject.propertyRange!, 'true'),
                  ];
                  return fixes;
                },
              },
            ],
          });
        } else {
          return;
        }
      },
    };
  },
});
