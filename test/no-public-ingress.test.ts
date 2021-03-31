import * as path from 'path';
import { TSESLint } from '@typescript-eslint/experimental-utils';
import rule from '../src/rules/no-public-ingress';

// let linter: ESLint;
const ruleTester = new TSESLint.RuleTester({
  parser: path.resolve('./node_modules/@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
});

/**
 * Testing scenarios
 * 1. No connections.allowDefaultPortFromAnyIpv4();
 * 2. No connections.allowFromAnyIpv4();
 * 3. No Peer.anyIpv4() or Peer.ipv4('0.0.0.0/0') when using:
 *  | addIngressRule()
 *  | connections.allowFrom()
 *  | connections.allowDefaultPortFrom()
 *
 */

ruleTester.run('no-ipv4-from-anywhere', rule, {
  valid: [
    {
      code: `
const peer = ec2.Peer.ipv4('10.10.10.10/16');
`,
    },
  ],
  invalid: [
    {
      code: `
const peer = ec2.Peer.ipv4('0.0.0.0/0');
`,
      errors: [
        {
          messageId: 'noIpv4FromAnywhere',
        },
      ],
    },
    {
      code: `
const peer = Peer.ipv4('0.0.0.0/0');
`,
      errors: [
        {
          messageId: 'noIpv4FromAnywhere',
        },
      ],
    },
    {
      code: `
const peer = ec2.Peer.anyIpv4();
`,
      errors: [
        {
          messageId: 'noIpv4FromAnywhere',
        },
      ],
    },
    {
      code: `
const peer = Peer.anyIpv4();
`,
      errors: [
        {
          messageId: 'noIpv4FromAnywhere',
        },
      ],
    },
  ],
});

ruleTester.run('no-allow-default-port-from-anywhere', rule, {
  valid: [
    {
      code: `
const peer = ec2.Peer.ipv4('10.10.10.10/16');
`,
    },
  ],
  invalid: [
    {
      code: `
sg.connections.allowDefaultPortFromAnyIpv4();
`,
      errors: [
        {
          messageId: 'noAllowDefaultPortFromAnywhere',
        },
      ],
    },
  ],
});

ruleTester.run('no-allow-from-anywhere', rule, {
  valid: [
    {
      code: `
const peer = ec2.Peer.ipv4('10.10.10.10/16');
`,
    },
  ],
  invalid: [
    {
      code: `
sg.connections.allowFromAnyIpv4(ec2.Port.tcp(22));
`,
      errors: [
        {
          messageId: 'noIpv4FromAnywhere',
        },
      ],
    },
  ],
});