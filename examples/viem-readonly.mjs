import { createPublicClient, http } from 'viem';
import { defineChain } from 'viem';

const marooTestnet = defineChain({
  id: 450815,
  name: 'Maroo Testnet',
  nativeCurrency: { name: 'Test OKRW', symbol: 'tOKRW', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc-testnet.maroo.io'] } },
  testnet: true,
});

const PCL_ADDRESS = '0x1000000000000000000000000000000000000005';
const pclAbi = [{
  type: 'function',
  name: 'policyTemplate',
  stateMutability: 'view',
  inputs: [{ name: 'templateId', type: 'string' }],
  outputs: [
    { name: 'templateId', type: 'string' },
    { name: 'name', type: 'string' },
    { name: 'description', type: 'string' },
    { name: 'paramSchema', type: 'bytes' },
  ],
}];

const client = createPublicClient({
  chain: marooTestnet,
  transport: http(),
});

const [chainId, blockNumber, template] = await Promise.all([
  client.getChainId(),
  client.getBlockNumber(),
  client.readContract({
    address: PCL_ADDRESS,
    abi: pclAbi,
    functionName: 'policyTemplate',
    args: ['DENYLIST_POLICY'],
  }),
]);

console.log(JSON.stringify({
  mode: 'READ_ONLY',
  chainId,
  blockNumber: blockNumber.toString(),
  pclTemplate: {
    id: template[0],
    name: template[1],
    description: template[2],
    schemaBytes: (template[3].length - 2) / 2,
  },
  signed: false,
  broadcast: false,
}, null, 2));
