import { ESLintUtils, TSESTree, TSESLint } from '@typescript-eslint/utils';
import * as util from '../util';

const createRule = ESLintUtils.RuleCreator(
  name => `${name}`,
);


type Options = [];
type MessageIds =
    | 'noRedshiftPublicAccess'


export default createRule<Options, MessageIds>({
  meta: {
    type: 'suggestion',
    schema: [],
    messages: {
      noRedshiftPublicAccess: 'AWS Redshift instances should not be publicly available',
    },
    docs: {
      suggestion: true,
      description: 'AWS Redshift instances should not be publicly available',
      recommended: 'warn',
    },
    fixable: 'code',
    hasSuggestions: true,
  },
  name: 'no-redshift-public-access',
  defaultOptions: [],
  create: context => {
    return {
      NewExpression(node: TSESTree.NewExpression) {
        const cdkObject = util.getCdkExpression({
          construct: 'Cluster',
          library: 'redshift',
          node: node,
          propertyKey: 'publiclyAccessible',
        });
        if (cdkObject?.propertyValue === true) {
          context.report({
            node,
            messageId: 'noRedshiftPublicAccess',
            loc: cdkObject.propertyLoc,
            suggest: [
              {
                messageId: 'noRedshiftPublicAccess',
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

