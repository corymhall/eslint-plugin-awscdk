import { AST_NODE_TYPES, ESLintUtils, TSESTree } from '@typescript-eslint/utils';
import * as util from '../util';

const createRule = ESLintUtils.RuleCreator(
  name => `${name}`,
);

type Options = [];
type MessageIds =
    | 'requireDynamoDBAutoScaling'

export default createRule<Options, MessageIds>({
  meta: {
    type: 'suggestion',
    schema: [],
    messages: {
      requireDynamoDBAutoScaling: 'DynamoDB tables should automatically scale capacity with demand',
    },
    docs: {
      description: `This control passes if the table uses either on-demand capacity mode or provisioned mode
      with auto scaling configured.\n
      Scaling capacity with demand avoids throttling exceptions, which helps to maintain availability of your applications.`,
      recommended: 'warn',
      extendsBaseRule: false,
    },
  },
  name: 'require-dynamodb-autoscale',
  defaultOptions: [],
  create: context => {
    function findTableMethods(node: TSESTree.NewExpression): boolean {
      const found = util.findNewExpression({
        construct: 'Table',
        library: 'dynamodb',
        node,
      });
      if (found) {
        var methods: {[name: string]: TSESTree.Node} = {};
        const scope = context.getScope();
        var variableName: string = '';
        switch (node.parent?.type) {
          case AST_NODE_TYPES.VariableDeclarator:
            if (node.parent.id.type === AST_NODE_TYPES.Identifier) {
              variableName = node.parent.id.name;
              methods = util.findMethods({
                scope,
                variableName,
              });
              break;
            }
            break;
          case AST_NODE_TYPES.AssignmentExpression:
            if (node.parent.left.type === AST_NODE_TYPES.MemberExpression && node.parent.left.object.type === AST_NODE_TYPES.ThisExpression) {
              if (node.parent.left.property.type === AST_NODE_TYPES.Identifier) {
                variableName = node.parent.left.property.name;
                methods = util.findMethods({
                  variableName,
                  node: context.getSourceCode().ast,
                });
              }
            }
            break;
          default:
            break;
        }

        if (variableName != '') {
          if (!('autoScaleReadCapacity' in methods) || !('autoScaleWriteCapacity' in methods)) {
            return false;
          }
        } else {
          return false;
        }
        return true;
      }
      return true;
    }
    return {
      NewExpression(node: TSESTree.NewExpression): void {
        const cdkObject = util.getCdkExpression({
          construct: 'Table',
          library: 'dynamodb',
          node,
          propertyKey: 'billingMode',
        });
        const cdkObject2 = util.getCdkExpression({
          construct: 'Table',
          library: 'dynamodb',
          node,
          propertyKey: 'replicationRegions',
        });
        const found = findTableMethods(node);

        if (cdkObject) {
          // if billingMode is not set & replicationRegions is not set then we need to check to see
          // if the autoscale methods are used.
          if (cdkObject.propertyValue === undefined && cdkObject2?.propertyValue === undefined && !found) {
            context.report({
              node,
              messageId: 'requireDynamoDBAutoScaling',
            });
            // if billingMode == 'PROVISIONED and we are not using methods to enable autoscaling
          } else if (cdkObject.propertyValue === 'PROVISIONED' && !found) {
            context.report({
              node,
              messageId: 'requireDynamoDBAutoScaling',
              loc: cdkObject.propertyLoc,
            });
          }
        } else {
          return;
        }
      },
    };
  },
});
