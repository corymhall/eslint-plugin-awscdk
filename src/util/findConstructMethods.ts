import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils';
import { findNewExpression, findMethods } from './';

interface findConstructMethodsProps {
  node: TSESTree.NewExpression;
  scope: TSESLint.Scope.Scope;
  construct: string;
  library: string;
  sourceCode: TSESTree.Program;
  methods: string[];
}

export function findConstructMethods(props: findConstructMethodsProps): {[name: string]: TSESTree.Node} {
  let methods: {[name: string]: TSESTree.Node} = {};
  const found = findNewExpression({
    construct: props.construct,
    library: props.library,
    node: props.node,
  });
  if (found) {
    const scope = props.scope;
    var variableName: string = '';
    switch (props.node.parent?.type) {
      case AST_NODE_TYPES.VariableDeclarator:
        if (props.node.parent.id.type === AST_NODE_TYPES.Identifier) {
          variableName = props.node.parent.id.name;
          methods = findMethods({
            scope,
            variableName,
          });
          break;
        }
        break;
      case AST_NODE_TYPES.AssignmentExpression:
        if (props.node.parent.left.type === AST_NODE_TYPES.MemberExpression && props.node.parent.left.object.type === AST_NODE_TYPES.ThisExpression) {
          if (props.node.parent.left.property.type === AST_NODE_TYPES.Identifier) {
            variableName = props.node.parent.left.property.name;
            methods = findMethods({
              variableName,
              node: props.sourceCode,
            });
          }
        }
        break;
      default:
        break;
    }

    // let hasMethod = true;
    //if (variableName != '') {
    //props.methods.forEach((m: string) => {
    //if (!Object.keys(methods).includes(m)) {
    //hasMethod = false;
    //}
    //})
    //} else {
    //return hasMethod;
    //}
    // return hasMethod;
  }
  return methods;
}
