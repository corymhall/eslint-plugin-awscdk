import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils';
interface findClassProperty {
  node: TSESTree.Program;
  constructs: string[];
  library: string;
  variableName: string;
}
export function findClassProperty(props: findClassProperty) {
  let found = false;

  props.node.body.forEach(b => {
    if (b.type === AST_NODE_TYPES.ExportNamedDeclaration && b.declaration?.type === AST_NODE_TYPES.ClassDeclaration) {
      b.declaration.body.body.forEach(bb => {
        if (bb.type === AST_NODE_TYPES.PropertyDefinition) {
          if (bb.typeAnnotation?.typeAnnotation.type === AST_NODE_TYPES.TSTypeReference) {
            switch (bb.typeAnnotation.typeAnnotation.typeName.type) {
              case AST_NODE_TYPES.Identifier:
                if (props.constructs.includes(bb.typeAnnotation.typeAnnotation.typeName.name)) {
                  found = true;
                }
                break;
              case AST_NODE_TYPES.TSQualifiedName:
                if (props.constructs.includes(bb.typeAnnotation.typeAnnotation.typeName.right.name) && (
                  bb.typeAnnotation.typeAnnotation.typeName.left.type === AST_NODE_TYPES.Identifier &&
                    bb.typeAnnotation.typeAnnotation.typeName.left.name === props.library)
                ) {
                  found = true;
                }
            }
          }
        }
      });
    }
  });
  return found;
}
