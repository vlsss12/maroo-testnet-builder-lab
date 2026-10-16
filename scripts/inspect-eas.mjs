import { Interface, JsonRpcProvider, isAddress, ZeroHash } from 'ethers';

export const EAS_ABI = [
  'function getAttestation(bytes32 uid) view returns (tuple(bytes32 uid, bytes32 schema, uint64 time, uint64 expirationTime, uint64 revocationTime, bool revoked, address attester, address recipient, bool refUID, bytes data))',
];

/** Read one EAS attestation with eth_call only. No wallet, signer, or broadcast. */
export async function inspectEasAttestation({ provider, easAddress, uid = ZeroHash }) {
  if (!isAddress(easAddress)) throw new Error('EAS_ADDRESS must be a valid EVM address.');
  if (!/^0x[0-9a-fA-F]{64}$/.test(uid)) throw new Error('ATTESTATION_UID must be a 32-byte hex UID.');
  const iface = new Interface(EAS_ABI);
  const data = iface.encodeFunctionData('getAttestation', [uid]);
  const raw = await provider.call({ to: easAddress, data });
  const [entry] = iface.decodeFunctionResult('getAttestation', raw);
  return {
    uid: entry.uid,
    schema: entry.schema,
    time: entry.time.toString(),
    expirationTime: entry.expirationTime.toString(),
    revocationTime: entry.revocationTime.toString(),
    revoked: entry.revoked,
    attester: entry.attester,
    recipient: entry.recipient,
    dataBytes: (entry.data.length - 2) / 2,
    readOnly: true,
    signed: false,
    broadcast: false,
  };
}

async function main() {
  const [easAddress, uid] = process.argv.slice(2);
  if (!easAddress) {
    console.error('Usage: npm run inspect:eas -- <EAS_ADDRESS> [ATTESTATION_UID]');
    process.exitCode = 2;
    return;
  }
  const provider = new JsonRpcProvider(process.env.MAROO_RPC_URL || 'https://rpc-testnet.maroo.io');
  try {
    console.log(JSON.stringify(await inspectEasAttestation({ provider, easAddress, uid }), null, 2));
    console.log('Read-only EAS inspection complete; no wallet or transaction was used.');
  } finally { await provider.destroy(); }
}

if (process.argv[1]?.endsWith('/inspect-eas.mjs')) main().catch((error) => {
  console.error(`EAS inspection failed: ${error.shortMessage || error.message}`);
  process.exitCode = 1;
});
