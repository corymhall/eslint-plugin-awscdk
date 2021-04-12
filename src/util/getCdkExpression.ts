import { TSESTree, AST_NODE_TYPES } from '@typescript-eslint/experimental-utils';
import { findNewExpression } from './findNewExpression';

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

  const proceed = findNewExpression({
    construct: params.construct,
    library: params.library,
    node: params.node,
  });

  // if there is a new Bucket expression that is from the core 'aws-s3' library
  if (proceed) {
    // looking for a particular property, e.g. 'encryption' and returns information about that Node
    let hasObjectExpression = false;
    for (let i = 0; i < params.node.arguments.length; i++) {
      let a = params.node.arguments[i];
      if (a.type === AST_NODE_TYPES.ObjectExpression) {
        hasObjectExpression = true;
        for (let p = 0; p < a.properties.length; p++) {
          let pr = a.properties[p] as TSESTree.Property;
          if (pr.key.type === AST_NODE_TYPES.Identifier && pr.key.name === params.propertyKey) {
            switch (pr.value.type) {
              case AST_NODE_TYPES.MemberExpression:
                let value = pr.value.property as TSESTree.Identifier;
                return {
                  objectExpression: a,
                  propertyValue: value.name,
                  propertyLoc: value.loc,
                  propertyRange: value.range,
                };
              case AST_NODE_TYPES.Literal:
                return {
                  objectExpression: a,
                  propertyValue: pr.value.value,
                  propertyLoc: pr.value.loc,
                  propertyRange: pr.value.range,
                };
              case AST_NODE_TYPES.ArrayExpression:
                return {
                  objectExpression: a,
                  propertyValue: pr.value.elements,
                  propertyLoc: pr.value.loc,
                  propertyRange: pr.value.range,
                };
              case AST_NODE_TYPES.Identifier:
                return {
                  objectExpression: a,
                  propertyValue: pr.value.name,
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
    if (!hasObjectExpression) {
      return {
        objectExpression: params.node,
      };
    }

  }
  return undefined;
}