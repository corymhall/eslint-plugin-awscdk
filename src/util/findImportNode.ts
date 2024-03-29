import { TSESTree, AST_NODE_TYPES } from '@typescript-eslint/utils';

export function findImportNode(node: TSESTree.Node, constructName?: string, hasLibrary?: boolean, libraryName?: string): boolean {
  let root = false;
  let n = node;
  if (!n.parent) {
    return false;
  }
  // find the root node of the file in order to find the import statements
  while (!root) {
    if (n.parent?.type === AST_NODE_TYPES.Program) {
      for (let i = 0; i < n.parent.body.length; i++) {
        let body = n.parent.body[i] as TSESTree.ImportDeclaration;
        if (body.type === AST_NODE_TYPES.ImportDeclaration) {
          for (let s = 0; s < body.specifiers.length; s++) {
            let spec = body.specifiers[s] as TSESTree.ImportSpecifier;
            switch (body.source.value) {
              case 'monocdk':
              case 'aws-cdk-lib':
              case `aws-cdk-lib/aws-${libraryName}`:
              case `@aws-cdk/aws-${libraryName}`:
              case `@aws-cdk/aws-${libraryName}-alpha`:
              case `monocdk/aws-${libraryName}`:
                // e.g. import * as s3 from '@aws-cdk/aws-s3';
                // e.g. import { aws_s3 as s3 } from 'monocdk';
                if (hasLibrary && spec.local.name === libraryName) {
                  return true;
                  // e.g. import { Bucket } from '@aws-cdk/aws-s3';
                } else if (!hasLibrary && spec.local.name === constructName) {
                  return true;
                }
                break;
              default:
                break;
            }
          }
        }
      }
    }
    if (n.parent) {
      n = n.parent!;
    } else {
      root = true;
    }
  }
  return false;
}
