import { ESLintUtils, TSESTree, TSESLint, AST_NODE_TYPES } from '@typescript-eslint/utils';
import * as util from '../util';

const createRule = ESLintUtils.RuleCreator(
  name => `${name}`,
);

type Options = [];
type MessageIds =
    | 'missingEncryption'
    | 'enableKmsManagedEncryption'

export default createRule<Options, MessageIds>({
  meta: {
    type: 'suggestion',
    schema: [],
    messages: {
      missingEncryption: 'Encryption should be enabled for all S3 Buckets',
      enableKmsManagedEncryption: 'Enable KMS_MANAGED encryption for this bucket',
    },
    docs: {
      suggestion: true,
      description: 'Encryption should be enabled for all S3 buckets',
      recommended: 'warn',
      extendsBaseRule: false,
    },
    fixable: 'code',
    hasSuggestions: true,
  },
  name: 'require-bucket-encryption',
  defaultOptions: [],
  create: context => {
    return {
      NewExpression(node: TSESTree.NewExpression) {
        const spaces = ' '.repeat(util.findLocation(node) + 2);
        let objectRange: TSESTree.Range;
        const cdkObject = util.getCdkExpression({
          construct: 'Bucket',
          library: 's3',
          node: node,
          propertyKey: 'encryption',
        });
        if (cdkObject && !cdkObject?.propertyValue) {
          let o = cdkObject.objectExpression as TSESTree.Node;
          if (o.type === AST_NODE_TYPES.NewExpression) {
            context.report({
              node,
              messageId: 'missingEncryption',
            });
          } else {
            objectRange = cdkObject?.objectExpression.range;
            context.report({
              node,
              messageId: 'missingEncryption',
              suggest: [
                {
                  messageId: 'enableKmsManagedEncryption',
                  fix: (fixer: TSESLint.RuleFixer) => {
                    const fixes: TSESLint.RuleFix[] = [
                      fixer.insertTextAfterRange([objectRange[0], objectRange[0]+2], `${spaces}encryption: s3.BucketEncryption.KMS_MANAGED,\n`),
                    ];
                    return fixes;
                  },

                },
              ],
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
