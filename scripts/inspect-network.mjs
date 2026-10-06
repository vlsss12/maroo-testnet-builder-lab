import 'dotenv/config';
import { JsonRpcProvider, isAddress } from 'ethers';

export const MAROO_CHAIN_ID = 450815n;
export const DEFAULT_RPC_URL = 'https://rpc-testnet.maroo.io';

const OPTIONAL_SURFACES = {
  PCL_ADDRESS: 'PCL',
  EAS_ADDRESS: 'EAS',
  ERC8004_IDENTITY_REGISTRY: 'ERC-8004 Identity Registry',
  AGENT_PRECOMPILE: 'Agent precompile',
};

export function validateOptionalAddresses(env) {
  const result = {};
  for (const [key, label] of Object.entries(OPTIONAL_SURFACES)) {
    const value = env[key];
    if (value === undefined || value === '') continue;
    if (!isAddress(value)) throw new Error(`${key} must be a valid EVM address when set.`);
    result[label] = value;
  }
  return result;
}

/** Read-only RPC health check. It never loads a key, signs, or broadcasts. */
export async function inspectNetwork({ provider, optionalAddresses = {} }) {
  const network = await provider.getNetwork();
  if (network.chainId !== MAROO_CHAIN_ID) {
    throw new Error(`Wrong network: expected Maroo Testnet (${MAROO_CHAIN_ID}), received ${network.chainId}.`);
  }
  const blockNumber = await provider.getBlockNumber();
  const feeData = await provider.getFeeData();
  const code = {};
  for (const [label, address] of Object.entries(optionalAddresses)) {
    code[label] = { address, deployed: (await provider.getCode(address)) !== '0x' };
  }
  return {
    chainId: network.chainId.toString(),
    rpc: process.env.MAROO_RPC_URL || DEFAULT_RPC_URL,
    latestBlock: blockNumber,
    gasPriceWei: feeData.gasPrice?.toString() ?? null,
    surfaces: code,
    readOnly: true,
    signed: false,
    broadcast: false,
  };
}

async function main() {
  const provider = new JsonRpcProvider(process.env.MAROO_RPC_URL || DEFAULT_RPC_URL);
  try {
    const result = await inspectNetwork({ provider, optionalAddresses: validateOptionalAddresses(process.env) });
    console.log(JSON.stringify(result, null, 2));
    console.log('Read-only network inspection complete; no wallet or transaction was used.');
  } finally {
    await provider.destroy();
  }
}

if (process.argv[1]?.endsWith('/inspect-network.mjs')) main().catch((error) => {
  console.error(`Network inspection failed: ${error.shortMessage || error.message}`);
  process.exitCode = 1;
});
