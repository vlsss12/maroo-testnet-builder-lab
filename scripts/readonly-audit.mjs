import { JsonRpcProvider } from 'ethers';
import { inspectNetwork, validateOptionalAddresses, DEFAULT_RPC_URL } from './inspect-network.mjs';
import { inspectPcl } from './inspect-pcl.mjs';

/**
 * Build a safe, read-only Maroo report. This module intentionally does not
 * load dotenv, read a private key, create a signer, or broadcast a call.
 */
export async function buildReadonlyAudit({ provider, env = process.env, templateId = 'DENYLIST_POLICY' } = {}) {
  if (!provider) throw new Error('A JSON-RPC provider is required.');

  const report = {
    mode: 'READ_ONLY',
    walletLoaded: false,
    signed: false,
    broadcast: false,
    checks: {},
  };

  try {
    report.checks.network = { ok: true, result: await inspectNetwork({
      provider,
      optionalAddresses: validateOptionalAddresses(env),
    }) };
  } catch (error) {
    report.checks.network = { ok: false, error: error.shortMessage || error.message };
  }

  try {
    report.checks.pcl = { ok: true, result: await inspectPcl({ provider, templateId }) };
  } catch (error) {
    report.checks.pcl = { ok: false, error: error.shortMessage || error.message };
  }

  return report;
}

async function main() {
  const templateId = process.argv[2] || 'DENYLIST_POLICY';
  const rpcUrl = process.env.MAROO_RPC_URL || DEFAULT_RPC_URL;
  const provider = new JsonRpcProvider(rpcUrl);
  try {
    const report = await buildReadonlyAudit({ provider, templateId });
    console.log(JSON.stringify(report, null, 2));
    console.log('Read-only audit complete; no wallet, signer, private key, or transaction was used.');
  } finally {
    await provider.destroy();
  }
}

if (process.argv[1]?.endsWith('/readonly-audit.mjs')) {
  main().catch((error) => {
    console.error(`Read-only audit failed: ${error.shortMessage || error.message}`);
    process.exitCode = 1;
  });
}
