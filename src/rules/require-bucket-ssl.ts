import { ESLintUtils, TSESTree, TSESLint } from '@typescript-eslint/experimental-utils';
import * as util from '../util';

const createRule = ESLintUtils.RuleCreator(
  name => `${name}`,
);

type Options = [];
type MessageIds =
    | 'requireSSL'

export default createRule<Options, MessageIds>({
  meta: {
    type: 'suggestion',
    schema: [],
    messages: {
      requireSSL: 'S3 buckets should require requests to use Secure Socket Layer',
    },
    docs: {
      category: 'Best Practices',
      description: 'This checks whether S3 buckets have policies that require requests to use Secure Socket Layer (SSL)',
      recommended: 'warn',
      extendsBaseRule: false,
    },
    fixable: 'code',
  },
  name: 'require-bucket-ssl',
  defaultOptions: [],
  create: context => {
    return {
      NewExpression(node: TSESTree.NewExpression) {
        const spaces = ' '.repeat(node.loc.start.column + 2);
        let objectRange: TSESTree.Range;
        const cdkObject = util.getCdkExpression({
          construct: 'Bucket',
          library: 's3',
          node: node,
          propertyKey: 'requireSSL',
        });
        if (cdkObject?.propertyValue === undefined) {
          objectRange = cdkObject?.objectExpression.range;
          context.report({
            node,
            messageId: 'requireSSL',
            suggest: [
              {
                messageId: 'requireSSL',
                fix: (fixer: TSESLint.RuleFixer) => {
                  const fixes: TSESLint.RuleFix[] = [
                    fixer.insertTextBeforeRange([objectRange[1]-1, objectRange[1]], `${spaces}requireSSL: true,\n`),
                  ];
                  return fixes;
                },

              },
            ],
          });
        } else if (cdkObject?.propertyValue === false) {
          context.report({
            node,
            messageId: 'requireSSL',
            loc: cdkObject.propertyLoc,
            suggest: [
              {
                messageId: 'requireSSL',
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
        return;
      },
    };
  },
});