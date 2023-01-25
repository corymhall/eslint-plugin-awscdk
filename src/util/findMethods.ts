import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils';

interface findMethodsProps {
  scope?: TSESLint.Scope.Scope;
  node?: TSESTree.Program;
  variableName: string;
}
export function findMethods(props: findMethodsProps): {[name: string]: TSESTree.Node} {
  let methods: {[name: string]: TSESTree.Node} = {};

  // if the method is called from a variable, i.e.
  //     const table = new dynamodb.Table(...);
  //     table.autoScaleReadCapacity();
  // then it will be in the scope references.
  props.scope?.references.forEach(reference => {
    // console.log('firstreference', reference);
    if (reference.identifier.type === AST_NODE_TYPES.Identifier && reference.identifier.name === props.variableName) {
      if (reference.identifier?.parent?.type === AST_NODE_TYPES.MemberExpression) {
        // console.log('referenceparent', reference.identifier.parent);
        if (reference.identifier.parent.property.type === AST_NODE_TYPES.Identifier) {
          // console.log('reference', reference.identifier.parent.parent);
          // methods.push(reference.identifier.parent.property.name);
          methods[reference.identifier.parent.property.name] = reference.identifier.parent;
        }
      }
    }
  });

  // if the method is called from a class property, i.e.
  //
  //     export class MyConstruct extends cdk.Construct {
  //       public readonly table: dynamodb.ITable;
  //       constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
  //         super(scope, id, props);
  //
  //         this.table = new dynamodb.Table(...);
  //         this.table.autoScaleReadCapacity();
  //
  //       }
  //     }
  //
  // Then we need to look for the method calls by going through the entire program
  props.node?.body.forEach(b => {
    if (b.type === AST_NODE_TYPES.ExportNamedDeclaration && b.declaration?.type === AST_NODE_TYPES.ClassDeclaration) {
      b.declaration.body.body.forEach(bb => {
        if (bb.type === AST_NODE_TYPES.MethodDefinition) {
          if (bb.key.type === AST_NODE_TYPES.Identifier && bb.key.name === 'constructor') {
            bb.value.body?.body.forEach(bbb => {
              if (bbb.type === AST_NODE_TYPES.ExpressionStatement && bbb.expression.type === AST_NODE_TYPES.CallExpression) {
                if (bbb.expression.callee.type === AST_NODE_TYPES.MemberExpression) {
                  if (bbb.expression.callee.object.type === AST_NODE_TYPES.MemberExpression &&
                    bbb.expression.callee.object.object.type === AST_NODE_TYPES.ThisExpression &&
                    (bbb.expression.callee.object.property.type === AST_NODE_TYPES.Identifier &&
                        bbb.expression.callee.object.property.name === props.variableName) &&
                        bbb.expression.callee.property.type === AST_NODE_TYPES.Identifier
                  ) {
                    // console.log('bbb', bbb.expression.callee);
                    // methods.push(bbb.expression.callee.property.name);
                    // methods.push(bbb.expression.callee);
                    methods[bbb.expression.callee.property.name] = bbb.expression.callee;
                  }
                }
              }
            });
          }
        }
      });
    }
  });
  return methods;
}
