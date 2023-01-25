import { TSESTree, AST_NODE_TYPES } from '@typescript-eslint/utils';
import { findImportNode } from './findImportNode';

interface findNewExpressionParams {
  node: TSESTree.NewExpression;
  library: string;
  construct: string;
}

export function findNewExpression(
  params: findNewExpressionParams,
): boolean {

  let callee = params.node.callee;
  let proceed = false;

  // type will be Identifier when doing 'new Bucket()'
  /**
     * callee: <ref *1> {
     * type: 'Identifier',
     * name: 'Bucket',
     *  ...
     * },
    */
  if (callee.type === AST_NODE_TYPES.Identifier) {
    let c = callee as TSESTree.Identifier;
    if (c.name === params.construct) {
      proceed = findImportNode(params.node, params.construct, false, params.library);
    }
    // type will be MemberExpression when doing 'new s3.Bucket()'
    /**
     * callee: <ref *1> {
     * type: 'MemberExpression',
     * object: {
     *  type: 'Identifier',
     *  name: 's3',
     *  ...
     * },
     * property: {
     *  type: 'Identifier',
     *  name: 'Bucket',
     *  ...
     * },
    */

  } else if (callee.type === AST_NODE_TYPES.MemberExpression) {
    let c = callee as TSESTree.MemberExpression;
    if (c.object.type === AST_NODE_TYPES.Identifier) {
      let object = c.object as TSESTree.Identifier;
      let property = c.property as TSESTree.Identifier;
      if (object.name === params.library && property.name === params.construct) {
        proceed = findImportNode(params.node, params.construct, true, params.library);
      }
    }
  }

  return proceed;
}
