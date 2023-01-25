import { ESLintUtils, TSESTree, AST_NODE_TYPES } from '@typescript-eslint/utils';
// import { Rule } from 'eslint';
// import * as util from '../util';

const createRule = ESLintUtils.RuleCreator(
  name => `${name}`,
);


type Options = [];
type MessageIds =
    | 'noAllowFromAnywhere'
    | 'noAllowDefaultPortFromAnywhere'
    | 'noIpv4FromAnywhere'


export default createRule<Options, MessageIds>({
  meta: {
    type: 'suggestion',
    schema: [],
    messages: {
      noAllowFromAnywhere: 'Using allowFromAnyIpv4() will add an ingress rule from from 0.0.0.0/0',
      noAllowDefaultPortFromAnywhere: 'Using allowDefaultPortFromAnyIpv4() will add an ingress rule from from 0.0.0.0/0 on the default port',
      noIpv4FromAnywhere: 'You are allowing ingress from 0.0.0.0/0',
    },
    docs: {
      requiresTypeChecking: true,
      description: 'Security Group rules should not allow access from anywhere',
      recommended: 'warn',
      extendsBaseRule: false,
    },
  },
  name: 'no-public-ingress',
  defaultOptions: [],
  create: context => {
    function parseArguments(args: TSESTree.Node[]): boolean {
      if (args[0].type === AST_NODE_TYPES.Literal) {
        if (args[0].value === '0.0.0.0/0') {
          return false;
        }
      }
      return true;
    }
    return {
      CallExpression(node: TSESTree.CallExpression) {
        const args = node.arguments;
        if (node.callee.type === AST_NODE_TYPES.MemberExpression) {
          const callee = node.callee as TSESTree.MemberExpression;

          // e.g. ec2.Peer.anyIpv4()
          if (callee.object.type === AST_NODE_TYPES.MemberExpression) {
            const property = callee.object.property as TSESTree.Identifier;

            if (property.name === 'Peer' && callee.property.type === AST_NODE_TYPES.Identifier) {
              switch (callee.property.name) {
                case 'anyIpv4':
                  context.report({
                    node,
                    messageId: 'noIpv4FromAnywhere',
                  });
                  break;
                case 'ipv4':
                  if (!parseArguments(args)) {
                    context.report({
                      node,
                      messageId: 'noIpv4FromAnywhere',
                    });
                  }
                  break;
              }
            }
            // e.g. Peer.anyIpv4()
          } else if (callee.object.type === AST_NODE_TYPES.Identifier) {
            if (callee.object.name === 'Peer') {
              if (callee.property.type === AST_NODE_TYPES.Identifier) {
                switch (callee.property.name) {
                  case 'anyIpv4':
                    context.report({
                      node,
                      messageId: 'noIpv4FromAnywhere',
                    });
                    break;
                  case 'ipv4':
                    if (!parseArguments(args)) {
                      context.report({
                        node,
                        messageId: 'noIpv4FromAnywhere',
                      });
                    }
                    break;
                }
              }
            }
          }

          if (callee.property.type === AST_NODE_TYPES.Identifier) {
            switch (callee.property.name) {
              case 'allowFromAnyIpv4':
                context.report({
                  node,
                  messageId: 'noIpv4FromAnywhere',
                });
                break;
              case 'allowDefaultPortFromAnyIpv4':
                context.report({
                  node,
                  messageId: 'noAllowDefaultPortFromAnywhere',
                });
                break;
            }
          }
        }
        return;
      },
    };
  },
});

