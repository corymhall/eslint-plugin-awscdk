import { ESLintUtils, TSESTree, TSESLint, AST_NODE_TYPES } from '@typescript-eslint/utils';
import * as util from '../util';

const createRule = ESLintUtils.RuleCreator(
  name => `${name}`,
);


type Options = [];
type MessageIds =
    | 'noS3PublicRead'
    | 'bucketAllowsPublicRead'
    | 'bucketACLAllowsPublicRead'
    | 'bucketPolicyAllowsPublicRead'


export default createRule<Options, MessageIds>({
  meta: {
    type: 'suggestion',
    schema: [],
    messages: {
      noS3PublicRead: 'S3 Buckets should not allow public read',
      bucketACLAllowsPublicRead: 'The configured bucket ACL is allowing public read access',
      bucketAllowsPublicRead: 'The bucket configuration allows public read access',
      bucketPolicyAllowsPublicRead: 'The configured bucket resource policy allows public read access',
    },
    docs: {
      requiresTypeChecking: true,
      suggestion: true,
      description: 'Buckets should not allow public read access',
      recommended: 'warn',
      extendsBaseRule: false,
    },
    fixable: 'code',
    hasSuggestions: true,
  },
  name: 'no-s3-public-read',
  defaultOptions: [],
  create: context => {
    function parsePrincipalsInPolicy(node: TSESTree.NewExpression) {
      const cdkPrincipalObject = util.getCdkExpression({
        construct: 'PolicyStatement',
        library: 'iam',
        node,
        propertyKey: 'principals',
      });
      cdkPrincipalObject?.propertyValue?.forEach((pr: any) => {
        const prop = pr as TSESTree.Node;
        if (prop.type === AST_NODE_TYPES.Literal) {
          if (prop.value === '*') {
            context.report({
              messageId: 'noS3PublicRead',
              node: node,
              loc: prop.loc,
            });
          }
        }
      });
    }

    function findBucketPolicyMethods(node: TSESTree.NewExpression) {
      const methods = util.findConstructMethods({
        construct: 'BucketPolicy',
        library: 's3',
        methods: [],
        node,
        scope: context.getScope(),
        sourceCode: context.getSourceCode().ast,
      });
      if ('document' in methods) {
        if (methods.document.parent?.type === AST_NODE_TYPES.MemberExpression) {
          const parentMemberExp = methods.document.parent;
          if (methods.document.parent?.parent?.type === AST_NODE_TYPES.CallExpression) {
            methods.document.parent.parent.arguments.forEach((arg: any) => {
              if (arg.type === AST_NODE_TYPES.ArrayExpression) {
                arg.elements.forEach((ele: any) => {
                  if (ele.type === AST_NODE_TYPES.NewExpression) {
                    parsePrincipalsInPolicy(ele);
                  }
                });
              }
              if (arg.type === AST_NODE_TYPES.Identifier) {
                const found = util.findVariable({
                  construct: 'PolicyStatement',
                  library: 'iam',
                  variableIdentifier: arg.name,
                  scope: context.getScope(),
                  memberExpression: parentMemberExp,
                });
                found.forEach(f => {
                  parsePrincipalsInPolicy(f);
                });
              }
              if (arg.type === AST_NODE_TYPES.ArrayExpression) {
                arg.elements.forEach((ele: any) => {
                  if (ele.type === AST_NODE_TYPES.Identifier) {
                    const found = util.findVariable({
                      construct: 'PolicyStatement',
                      library: 'iam',
                      variableIdentifier: ele.name,
                      scope: context.getScope(),
                      memberExpression: parentMemberExp,
                    });
                    found.forEach(f => {
                      parsePrincipalsInPolicy(f);
                    });
                  }
                });
              }
            });
          }
        }
      }
    }

    function findBucketMethods(node: TSESTree.NewExpression) {
      const methods = util.findConstructMethods({
        construct: 'Bucket',
        library: 's3',
        methods: [],
        node,
        scope: context.getScope(),
        sourceCode: context.getSourceCode().ast,
      });
      if ('grantPublicAccess' in methods) {
        context.report({
          messageId: 'noS3PublicRead',
          node: node,
          loc: methods.grantPublicAccess.loc,
          suggest: [
            {
              messageId: 'bucketAllowsPublicRead',
              fix: (fixer: TSESLint.RuleFixer) => {
                const fixes: TSESLint.RuleFix[] = [
                  fixer.remove(methods.grantPublicAccess.parent!.parent!),
                ];
                return fixes;
              },
            },
          ],
        });
      } else if ('addToResourcePolicy' in methods) {
        const policy = methods.addToResourcePolicy;
        if (policy.type === AST_NODE_TYPES.MemberExpression) {
          if (policy.parent?.type === AST_NODE_TYPES.CallExpression) {
            policy.parent.arguments.forEach((arg: any) => {
              if (arg.type === AST_NODE_TYPES.NewExpression) {
                parsePrincipalsInPolicy(arg);
              }
              if (arg.type === AST_NODE_TYPES.Identifier) {
                const found = util.findVariable({
                  construct: 'PolicyStatement',
                  library: 'iam',
                  variableIdentifier: arg.name,
                  scope: context.getScope(),
                  memberExpression: policy,
                });
                found.forEach(f => {
                  parsePrincipalsInPolicy(f);
                });
              }
            });
          }
        }
      }
    }

    return {
      NewExpression(node: TSESTree.NewExpression) {

        /**
         * 1. Prevent public write through access control:
         *
         *     new s3.Bucket(this, 'Bucket', {
         *       accessControl: s3.BucketAccessControl.PUBLIC_READ_WRITE,
         *     });
         *
        */
        const cdkObject = util.getCdkExpression({
          construct: 'Bucket',
          library: 's3',
          node: node,
          propertyKey: 'accessControl',
        });

        switch (cdkObject?.propertyValue) {
          case 'PUBLIC_READ_WRITE':
          case 'PUBLIC_READ':
          case 'AUTHENTICATED_READ':
            context.report({
              node,
              messageId: 'noS3PublicRead',
              loc: cdkObject.propertyLoc,
              suggest: [
                {
                  messageId: 'bucketACLAllowsPublicRead',
                  fix: (fixer: TSESLint.RuleFixer) => {
                    const fixes: TSESLint.RuleFix[] = [
                      fixer.replaceTextRange(cdkObject.propertyRange!, 'PRIVATE'),
                    ];
                    return fixes;
                  },

                },
              ],
            });
            break;
        }
        /**
         * 2. Prevent public write through bucket policy
         *
         *     const bucket = new s3.Bucket(this, 'Bucket');
         *     bucket.grantPublicAccess();
         */
        findBucketMethods(node);

        /**
         * 3. Prevent public write through bucket policy
         *
         *     const bucket = new s3.Bucket(this, 'Bucket');
         *     bucket.addToResourcePolicy(new iam.PolicyStatement({
         *       principals: ['*'],
         *     }));
         */
        findBucketPolicyMethods(node);

        /**
         * 4. Prevent public write through Block Public Access:
         *
         *     new s3.Bucket(this, 'Bucket', {
         *       blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
         *     });
         *
        */
        const cdkObject2 = util.getCdkExpression({
          construct: 'Bucket',
          library: 's3',
          node: node,
          propertyKey: 'blockPublicAccess',
        });
        if (cdkObject2?.propertyValue === 'BLOCK_ACLS') {
          context.report({
            node,
            messageId: 'noS3PublicRead',
            loc: cdkObject2.propertyLoc,
            suggest: [
              {
                messageId: 'bucketAllowsPublicRead',
                fix: (fixer: TSESLint.RuleFixer) => {
                  const fixes: TSESLint.RuleFix[] = [
                    fixer.replaceTextRange(cdkObject2.propertyRange!, 'BLOCK_ALL'),
                  ];
                  return fixes;
                },

              },
            ],
          });
        } else if (cdkObject2?.propertyValue?.type === AST_NODE_TYPES.NewExpression) {
          const properties: {[key: string]: string} = {};
          cdkObject2.propertyValue.arguments.forEach((arg: TSESTree.ObjectExpression) => {
            arg.properties.forEach(props => {
              if (props.type === AST_NODE_TYPES.Property) {
                const key = props.key as TSESTree.Identifier;
                const value = props.value as TSESTree.Literal;
                properties[key.name] = value.raw;
              }
            });
          });
          if (Object.keys(properties).length != 4) {
            context.report({
              node,
              messageId: 'noS3PublicRead',
              loc: cdkObject2.propertyLoc,
            });
          } else if (Object.values(properties).includes('false')) {
            context.report({
              node,
              messageId: 'noS3PublicRead',
              loc: cdkObject2.propertyLoc,
            });
          }
        } else {
          return;
        }
        return;
      },
    };
  },
});

