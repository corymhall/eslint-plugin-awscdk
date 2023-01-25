import { TSESTree, AST_NODE_TYPES, TSESLint } from '@typescript-eslint/utils';
// import { findNewExpression } from './findNewExpression';

interface Import {
  library: string;
  name: string;
}

interface findVariableProps {
  scope: TSESLint.Scope.Scope;
  library: string;
  construct: string;
  variableIdentifier: string;
  memberExpression: TSESTree.MemberExpression;
}
export function findVariable(props: findVariableProps): TSESTree.NewExpression[] {
  const imports: Import[] = [];
  let found = false;
  const variableDeclaration: TSESTree.NewExpression[] = [];

  props.scope.references.forEach(reference => {
    const variable = reference.resolved;
    if (variable?.defs[0].type === 'ImportBinding') {
      if (variable.defs[0].parent.type === AST_NODE_TYPES.ImportDeclaration) {
        const p = variable.defs[0].parent as TSESTree.ImportDeclaration;
        imports.push({
          library: p.source.value as string,
          name: variable.name,
        });
      }
    }
    if (variable?.identifiers[0].name === props.variableIdentifier) {
      variable.references.forEach(ref => {
        const parent = ref.identifier.parent;
        if (parent != props.memberExpression) {
          const parentv = ref.identifier.parent as TSESTree.VariableDeclarator;
          if (parentv.init?.type === AST_NODE_TYPES.NewExpression) {
            const foundImport = imports.find(( i: Import ) => {
              if (i.name === props.library) {
                switch (i.library) {
                  case `monocdk/aws-${props.library}`:
                  case `@aws-cdk/aws-${props.library}`:
                    return true;
                }
              }
              return false;
            });
            if (foundImport != undefined) {
              variableDeclaration.push(parentv.init);
              found = true;
            }
          } else if (parentv.init?.type === AST_NODE_TYPES.ArrayExpression) {
            parentv.init.elements.forEach(ele => {
              if (ele?.type === AST_NODE_TYPES.NewExpression) {
                const foundImport = imports.find(( i: Import ) => {
                  if (i.name === props.library) {
                    switch (i.library) {
                      case `monocdk/aws-${props.library}`:
                      case `@aws-cdk/aws-${props.library}`:
                        return true;
                    }
                  }
                  return false;
                });
                if (foundImport != undefined) {
                  variableDeclaration.push(ele);
                  found = true;
                }
              }
            });
          }
        }
        return found;
      });
    }
  });
  return variableDeclaration;
}
