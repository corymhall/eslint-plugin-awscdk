import { TSESTree, AST_NODE_TYPES } from '@typescript-eslint/utils';
export function findLocation(node: TSESTree.Node): number {
  if (
    node.parent?.type === AST_NODE_TYPES.VariableDeclaration ||
    node.parent?.type === AST_NODE_TYPES.VariableDeclarator) {
    return findLocation(node.parent);
  } else {
    return node.loc.start.column;
  }
}
