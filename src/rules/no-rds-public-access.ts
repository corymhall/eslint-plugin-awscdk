import { ESLintUtils, TSESTree, TSESLint, AST_NODE_TYPES } from '@typescript-eslint/experimental-utils';
import { Rule } from 'eslint';
import * as util from '../util';

const createRule = ESLintUtils.RuleCreator(
  name => `${name}`,
);


type Options = [];
type MessageIds =
    | 'noRDSPublicAccess'
    | 'rdsPrivateSubnets'
    | 'rdsIsolatedSubnets'


export default createRule<Options, MessageIds>({
  meta: {
    type: 'suggestion',
    schema: [],
    messages: {
      noRDSPublicAccess: 'AWS RDS instances should not be publicly available',
      rdsIsolatedSubnets: 'Configure subnetType to use ISOLATED subnets',
      rdsPrivateSubnets: 'Configure subnetType to use PRIVATE subnets',
    },
    docs: {
      category: 'Best Practices',
      description: 'AWS RDS instances should not be publicly available',
      recommended: 'warn',
    },
    fixable: 'code',
  },
  name: 'no-rds-public-access',
  defaultOptions: [],
  create: context => {
    return {
      NewExpression(node: TSESTree.NewExpression) {
        const cdkObject = util.getCdkExpression({
          construct: 'DatabaseInstance',
          library: 'rds',
          node: node,
          propertyKey: 'publiclyAccessible',
        });
        const cdkObject2 = util.getCdkExpression({
          construct: 'DatabaseInstance',
          library: 'rds',
          node: node,
          propertyKey: 'vpcSubnets',
        });
        cdkObject2?.propertyValue?.forEach((p: TSESTree.Property) => {
          if (p.key.type === AST_NODE_TYPES.Identifier && p.key.name === 'subnetType') {
            if (p.value.type === AST_NODE_TYPES.MemberExpression) {
              if (p.value.object.type === AST_NODE_TYPES.Identifier && p.value.object.name === 'SubnetType') {
                if (p.value.property.type === AST_NODE_TYPES.Identifier && p.value.property.name === 'PUBLIC') {
                  const range = p.value.property.range;
                  context.report({
                    node,
                    messageId: 'noRDSPublicAccess',
                    loc: p.value.property.loc,
                    suggest: [
                      {
                        messageId: 'rdsPrivateSubnets',
                        fix: (fixer: TSESLint.RuleFixer) => {
                          const fixes: Rule.Fix[] = [
                            fixer.replaceTextRange(range, 'PRIVATE'),
                          ];
                          return fixes;
                        },

                      },
                      {
                        messageId: 'rdsIsolatedSubnets',
                        fix: (fixer: TSESLint.RuleFixer) => {
                          const fixes: Rule.Fix[] = [
                            fixer.replaceTextRange(range, 'ISOLATED'),
                          ];
                          return fixes;
                        },

                      },
                    ],
                  });
                }
              } else if (p.value.object.type === AST_NODE_TYPES.MemberExpression) {
                if (p.value.object.property.type === AST_NODE_TYPES.Identifier && p.value.object.property.name === 'SubnetType') {
                  if (p.value.property.type === AST_NODE_TYPES.Identifier && p.value.property.name === 'PUBLIC') {
                    const range = p.value.property.range;
                    context.report({
                      node,
                      messageId: 'noRDSPublicAccess',
                      loc: p.value.property.loc,
                      suggest: [
                        {
                          messageId: 'rdsPrivateSubnets',
                          fix: (fixer: TSESLint.RuleFixer) => {
                            const fixes: Rule.Fix[] = [
                              fixer.replaceTextRange(range, 'PRIVATE'),
                            ];
                            return fixes;
                          },

                        },
                        {
                          messageId: 'rdsIsolatedSubnets',
                          fix: (fixer: TSESLint.RuleFixer) => {
                            const fixes: Rule.Fix[] = [
                              fixer.replaceTextRange(range, 'ISOLATED'),
                            ];
                            return fixes;
                          },

                        },
                      ],
                    });
                  }
                }
              }
            }
          }
        });
        if (cdkObject?.propertyValue === true) {
          context.report({
            node,
            messageId: 'noRDSPublicAccess',
            loc: cdkObject.propertyLoc,
            suggest: [
              {
                messageId: 'noRDSPublicAccess',
                fix: (fixer: TSESLint.RuleFixer) => {
                  const fixes: Rule.Fix[] = [
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

