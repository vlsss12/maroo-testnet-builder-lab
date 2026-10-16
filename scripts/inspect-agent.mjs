import { Interface, JsonRpcProvider, isAddress } from 'ethers';

export const AGENT_ABI = [
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function getAgentWallet(uint256 agentId) view returns (address)',
];

/** Read ERC-8004-style identity metadata where supported; never signs or broadcasts. */
export async function inspectAgentIdentity({ provider, registryAddress, agentId }) {
  if (!isAddress(registryAddress)) throw new Error('ERC8004_IDENTITY_REGISTRY must be a valid EVM address.');
  if (!/^[0-9]+$/.test(String(agentId))) throw new Error('agentId must be a non-negative integer.');
  const iface = new Interface(AGENT_ABI);
  const read = async (method) => {
    try {
      const data = iface.encodeFunctionData(method, [agentId]);
      const raw = await provider.call({ to: registryAddress, data });
      return iface.decodeFunctionResult(method, raw)[0];
    } catch (error) {
      return { unsupported: true, error: error.shortMessage || error.message };
    }
  };
  const owner = await read('ownerOf');
  const tokenURI = await read('tokenURI');
  const agentWallet = await read('getAgentWallet');
  return {
    registry: registryAddress,
    agentId: String(agentId),
    owner: typeof owner === 'string' ? owner : null,
    tokenURI: typeof tokenURI === 'string' ? tokenURI : null,
    agentWallet: typeof agentWallet === 'string' ? agentWallet : null,
    responses: { ownerOf: owner, tokenURI, getAgentWallet: agentWallet },
    readOnly: true,
    signed: false,
    broadcast: false,
  };
}

async function main() {
  const [registryAddress, agentId] = process.argv.slice(2);
  if (!registryAddress || agentId === undefined) {
    console.error('Usage: npm run inspect:agent -- <REGISTRY_ADDRESS> <AGENT_ID>');
    process.exitCode = 2;
    return;
  }
  const provider = new JsonRpcProvider(process.env.MAROO_RPC_URL || 'https://rpc-testnet.maroo.io');
  try {
    console.log(JSON.stringify(await inspectAgentIdentity({ provider, registryAddress, agentId }), null, 2));
    console.log('Read-only Agent inspection complete; no wallet or transaction was used.');
  } finally { await provider.destroy(); }
}

if (process.argv[1]?.endsWith('/inspect-agent.mjs')) main().catch((error) => {
  console.error(`Agent inspection failed: ${error.shortMessage || error.message}`);
  process.exitCode = 1;
});
