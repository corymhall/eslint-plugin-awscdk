// import { AST_NODE_TYPES, ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils';
// import * as util from '../util';

// const createRule = ESLintUtils.RuleCreator(
  // name => `${name}`,
// );

// type Options = [];
// type MessageIds =
    // | 'requireDynamoDBAutoScaling'

// export default createRule<Options, MessageIds>({
  // meta: {
    // type: 'suggestion',
    // schema: [],
    // messages: {
      // requireDynamoDBAutoScaling: 'DynamoDB tables should automatically scale capacity with demand',
    // },
    // docs: {
      // category: 'Best Practices',
      // description: `This control passes if the table uses either on-demand capacity mode or provisioned mode
      // with auto scaling configured.\n
      // Scaling capacity with demand avoids throttling exceptions, which helps to maintain availability of your applications.`,
      // recommended: 'warn',
      // extendsBaseRule: false,
    // },
  // },
  // name: 'require-dynamodb-autoscale',
  // defaultOptions: [],
  // create: context => {
    // return {
      // ExpressionStatement(node: TSESTree.ExpressionStatement): void {
        // var identifier: string | undefined = undefined;
        // var exp: TSESTree.MemberExpression | undefined = undefined;
        // if (node.expression.type === AST_NODE_TYPES.CallExpression) {
          // if (node.expression.callee.type === AST_NODE_TYPES.MemberExpression) {
            // exp = node.expression.callee;
            // if (node.expression.callee.property.type === AST_NODE_TYPES.Identifier) {
              // if (node.expression.callee.property.name === 'autoScaleReadCapacity') {
                // const o = node.expression.callee.object as TSESTree.Identifier;
                // identifier = o.name;
              // }
            // }
          // }
          // console.log(node.expression);
        // }
        // if (identifier && exp) {
          // const scope = context.getScope();
          // const found = util.findVariable({
            // construct: 'Table',
            // library: 'dynamodb',
            // memberExpression: exp,
            // scope,
            // variableIdentifier: identifier,
          // });
          // console.log('found', found);
          // if (!found) {
            // context.report({
              // messageId: 'requireDynamoDBAutoScaling',
              // node: node,
            // });
          // }
        // }
      // },
    // };
  // },
// });