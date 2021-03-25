import { TSESTree, AST_NODE_TYPES } from '@typescript-eslint/experimental-utils';
import { findImportNode } from './findImportNode';

interface CdkExpressionParams {
  node: TSESTree.NewExpression;
  library: string;
  construct: string;
  propertyKey: string;
}

interface CdkExpressionObject {
  objectExpression: any;
  propertyValue?: any;
  propertyLoc?: TSESTree.SourceLocation;
  propertyRange?: TSESTree.Range;
}

export function getCdkExpression(
  params: CdkExpressionParams,
): CdkExpressionObject | undefined {

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
      proceed = findImportNode(params.node, params.construct);
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
        proceed = findImportNode(params.node, params.construct, params.library);
      }
    }
  }

  // if there is a new Bucket expression that is from the core 'aws-s3' library
  if (proceed) {
    // looking for a particular property, e.g. 'encryption' and returns information about that Node
    for (let i = 0; i < params.node.arguments.length; i++) {
      let a = params.node.arguments[i];
      if (a.type === AST_NODE_TYPES.ObjectExpression) {
        for (let p = 0; p < a.properties.length; p++) {
          let pr = a.properties[p] as TSESTree.Property;
          if (pr.key.type === AST_NODE_TYPES.Identifier && pr.key.name === params.propertyKey) {
            if (pr.value.type === AST_NODE_TYPES.MemberExpression) {
              let value = pr.value.property as TSESTree.Identifier;
              return {
                objectExpression: a,
                propertyValue: value.name,
                propertyLoc: value.loc,
                propertyRange: value.range,
              };
            } else if (pr.value.type === AST_NODE_TYPES.Literal) {
              return {
                objectExpression: a,
                propertyValue: pr.value.value,
                propertyLoc: pr.value.loc,
                propertyRange: pr.value.range,
              };
            }
          }
        }
        return {
          objectExpression: a,
        };
      }
    }

  }
  return undefined;
}