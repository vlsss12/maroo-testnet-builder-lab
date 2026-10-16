import { JsonRpcProvider } from 'ethers';
import { inspectNetwork, validateOptionalAddresses, DEFAULT_RPC_URL } from './inspect-network.mjs';
import { inspectPcl } from './inspect-pcl.mjs';

export const OFFICIAL_PCL_TEMPLATES = [
  'EAS_POLICY',
  'DENYLIST_POLICY',
  'VOLUME_POLICY',
  'PERIODIC_VOLUME_POLICY',
  'AGENT_OKRW_TRANSFER_LIMIT_POLICY',
];

/**
 * Build a safe, read-only Maroo report. This module intentionally does not
 * load dotenv, read a private key, create a signer, or broadcast a call.
 */
export async function buildReadonlyAudit({ provider, env = {}, templateId } = {}) {
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
      rpcUrl: env.MAROO_RPC_URL || DEFAULT_RPC_URL,
    }) };
  } catch (error) {
    report.checks.network = { ok: false, error: error.shortMessage || error.message };
  }

  report.checks.pcl = {};
  const templates = templateId ? [templateId] : OFFICIAL_PCL_TEMPLATES;
  for (const id of templates) {
    try {
      report.checks.pcl[id] = { ok: true, result: await inspectPcl({ provider, templateId: id }) };
    } catch (error) {
      report.checks.pcl[id] = { ok: false, error: error.shortMessage || error.message };
    }
  }

  return report;
}

async function main() {
  const templateId = process.argv[2];
  const rpcUrl = process.env.MAROO_RPC_URL || DEFAULT_RPC_URL;
  const provider = new JsonRpcProvider(rpcUrl);
  try {
    const report = await buildReadonlyAudit({ provider, env: process.env, templateId });
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
