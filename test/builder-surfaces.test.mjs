import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildPreflightPlan } from '../scripts/preflight-plan.mjs';
import { inspectNetwork, MAROO_CHAIN_ID, validateOptionalAddresses } from '../scripts/inspect-network.mjs';
import { buildReadonlyAudit } from '../scripts/readonly-audit.mjs';
import { inspectAgentIdentity } from '../scripts/inspect-agent.mjs';

test('preflight plan rejects an amount above the local cap', () => {
  const result = buildPreflightPlan({ target: '0x0000000000000000000000000000000000000001', amount: '1001', maxAmount: '1000' });
  assert.equal(result.decision, 'REJECT');
  assert.equal(result.execution, 'PLAN_ONLY_NO_SIGN_NO_BROADCAST');
});

test('preflight plan enforces an optional target allowlist', () => {
  const result = buildPreflightPlan({
    target: '0x0000000000000000000000000000000000000001', amount: '10', maxAmount: '100',
    allowedTargets: ['0x0000000000000000000000000000000000000002'],
  });
  assert.equal(result.checks.targetAllowed, false);
  assert.equal(result.decision, 'REJECT');
});

test('network inspector is read-only and checks Maroo chain ID', async () => {
  const mock = {
    async getNetwork() { return { chainId: MAROO_CHAIN_ID }; },
    async getBlockNumber() { return 123; },
    async getFeeData() { return { gasPrice: 7000n }; },
    async getCode() { return '0x6000'; },
  };
  const result = await inspectNetwork({ provider: mock, optionalAddresses: { PCL: '0x0000000000000000000000000000000000000005' } });
  assert.equal(result.chainId, '450815');
  assert.equal(result.latestBlock, 123);
  assert.equal(result.surfaces.PCL.deployed, true);
  assert.equal(result.broadcast, false);
});

test('optional surface addresses are validated without exposing secrets', () => {
  assert.deepEqual(validateOptionalAddresses({ EAS_ADDRESS: '0x0000000000000000000000000000000000000005' }), { EAS: '0x0000000000000000000000000000000000000005' });
  assert.throws(() => validateOptionalAddresses({ EAS_ADDRESS: 'not-an-address' }), /valid EVM address/);
});

test('read-only audit never loads a wallet or broadcasts', async () => {
  const mock = {
    async getNetwork() { return { chainId: MAROO_CHAIN_ID }; },
    async getBlockNumber() { return 123; },
    async getFeeData() { return { gasPrice: 7000n }; },
    async getCode() { return '0x'; },
    async call() { throw new Error('mock PCL unavailable'); },
  };
  const report = await buildReadonlyAudit({ provider: mock, env: {} });
  assert.equal(report.mode, 'READ_ONLY');
  assert.equal(report.walletLoaded, false);
  assert.equal(report.signed, false);
  assert.equal(report.broadcast, false);
  assert.equal(report.checks.network.ok, true);
  assert.equal(report.checks.pcl.DENYLIST_POLICY.ok, false);
});

test('agent identity inspection stays read-only and tolerates unsupported methods', async () => {
  const mock = { async call() { throw new Error('method unavailable'); } };
  const result = await inspectAgentIdentity({
    provider: mock,
    registryAddress: '0x0000000000000000000000000000000000000005',
    agentId: '1',
  });
  assert.equal(result.readOnly, true);
  assert.equal(result.signed, false);
  assert.equal(result.broadcast, false);
  assert.equal(result.owner, null);
});
