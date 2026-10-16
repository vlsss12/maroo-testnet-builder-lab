# Maroo Testnet Policy Lab

A small, reproducible builder project for learning Maroo Testnet: deploy a Solidity activity contract, record an on-chain action, and then explore how Maroo's Programmable Compliance Layer (PCL) regulated path differs from a direct EVM call.

> **Status:** The simple activity contract was deployed and called on Maroo Testnet during the original experiment. A PCL proxy deployment was also attempted, but reverted. This repository does not claim that the PCL flow was successfully deployed or verified end to end.

This is an independent educational project, not an official Maroo repository. It does not promise points, an airdrop, token allocation, or any reward. Testnet tokens have no monetary value.

## What is included

- `contracts/MarooAirdropTest.sol` — minimal event-emitting activity contract.
- `scripts/compile.mjs` — compile the contract locally with `solc`.
- `scripts/deploy.mjs` — deploy to Maroo Testnet using a local environment variable.
- `scripts/record-activity.mjs` — call the contract and wait for confirmation.
- `scripts/deploy-pcl-proxy.mjs` — deploy and verify a Transparent PCL proxy using the documented initializer tuple.
- `scripts/configure-denylist.mjs` — attach a contract-scope `DENYLIST_POLICY` to a registered proxy.
- `scripts/verify-pcl-policy.mjs` — read-only `eth_call` checks for allowed and denied test signers.
- `scripts/inspect-pcl.mjs` — read-only PCL template and proxy-registry inspector; needs no wallet.
- `scripts/inspect-network.mjs` — read-only RPC health check plus optional EAS/ERC-8004/Agent surface bytecode checks.
- `scripts/readonly-audit.mjs` — combines network and PCL reads into a safe report; it never loads a wallet or broadcasts.
- `scripts/inspect-eas.mjs` — read-only EAS attestation lookup by contract address and UID.
- `scripts/inspect-agent.mjs` — read-only ERC-8004-style identity lookup with graceful support detection.
- `scripts/preflight-plan.mjs` — side-effect-free local target allowlist and amount-cap plan.
- `agent/README.md` — safe ERC-8004/Agent identity integration boundary.
- `maws/policy.example.json` — bounded MAWS policy example; it does not create or fund a wallet.
- `docs/BUILDER_GUIDE.md` — professional builder workflow covering RPC, PCL, EAS, ERC-8004, MAWS, testing, and publication.
- `.github/workflows/test.yml` — secret-free CI for tests and compilation.
- `CONTRIBUTING.md` and `SECURITY.md` — public contribution and security boundaries.
- `test/` — local Solidity compile/ABI and mocked read-only inspector checks.
- `GUIDE.md` — step-by-step setup, deployment, verification, and PCL learning path.
- `STATUS.md` — an honest record of what was and was not verified.

## Quick start

Requirements: Node.js 20 or newer, npm, a wallet configured for Maroo Testnet, and testnet tOKRW for gas.

```bash
npm install
cp .env.example .env
# Edit .env locally. Never commit the private key.
npm run compile
npm test
npm run deploy
npm run inspect:network
npm run audit:readonly
npm run audit:readonly
npm run preflight:plan -- 0x0000000000000000000000000000000000000001 500000 1000000
```

Copy the newly deployed contract address into `CONTRACT_ADDRESS` in your local `.env`, then:

```bash
npm run record
```

For the full walkthrough and PCL caveats, read [GUIDE.md](GUIDE.md).
For a shareable community version, read [docs/COMMUNITY_GUIDE.md](docs/COMMUNITY_GUIDE.md).

## Maroo Testnet

| Setting | Value |
| --- | --- |
| Chain ID | `450815` |
| RPC | `https://rpc-testnet.maroo.io` |
| Native test asset | `tOKRW` |
| Explorer | [explorer-testnet.maroo.io](https://explorer-testnet.maroo.io/) |
| Faucet | [faucet.maroo.io](https://faucet.maroo.io/) |

Always check the chain ID before signing. Do not use a mainnet wallet key or real funds for this tutorial.

## PCL learning path

Maroo documents two tracks: direct calls use the open path; calls made to a PCL-registered proxy use the regulated path and can enforce proxy-bound policies. The PCL path in this project is documented as a **follow-up exercise**, not as a completed deployment. Follow Maroo's current docs and verify the returned proxy registry entry before sending any call.

For the proxy exercise, set `IMPLEMENTATION_ADDRESS` in `.env` and run `npm run deploy:pcl`. For the optional denylist, set `CONTRACT_ADDRESS` to the verified proxy and `DENIED_TEST_ADDRESS` to a disposable test identity, then run `npm run configure:denylist`. These scripts have not yet been executed end-to-end on Maroo Testnet. Any signed transaction publicly links the signer wallet to that activity; only proceed if you accept that exposure.

To inspect the current network without a wallet or transaction, run `npm run inspect:pcl -- DENYLIST_POLICY` and optionally append a proxy address. It reports the official policy-template descriptor and whether the proxy appears in the PCL registry. This is an independent, read-only community utility.

After installing the policy, set `DENIED_TEST_KEY` to the local-only key matching `DENIED_TEST_ADDRESS` and run `npm run verify:pcl`. This performs only `eth_call` simulations: the allowed signer should pass and the denied signer should revert. Never commit or share either test key.

- [PCL dual-track model](https://docs.maroo.io/concepts/compliance/pcl-dual-track-model)
- [`deployPclProxy` API](https://docs.maroo.io/apis/contract/contract-pcl-deploy-pcl-proxy)
- [`changeContractPolicies` API](https://docs.maroo.io/apis/contract/pcl-update-contract-policy)
- [Maroo testnet setup](https://docs.maroo.io/resources/network/testnet-access)

## Privacy and safety

- No wallet address, personal name, or personal email is embedded in this repository.
- `.env` is ignored by Git. Never paste a private key, seed phrase, or wallet export into an issue, commit, screenshot, or shared guide.
- The original experiment's contract address and transaction hashes are intentionally omitted: public explorer links can reveal the originating wallet.
- This contract is a tutorial artifact, not production software. It has no access control and should not hold funds.
- Review every wallet prompt. Stop if the network, destination, calldata, or value is unexpected.

## Airdrop note

At the time this guide was prepared, we found no official Maroo airdrop or points rules to rely on. Testnet activity is useful for learning and demonstrating builder work, but it is not evidence of reward eligibility. Verify any future campaign only through Maroo's official channels.

## License

MIT. See [LICENSE](LICENSE).

## Read-only EAS and Agent checks

The optional EAS and ERC-8004-style Agent commands use `eth_call` only. They do not load a wallet, request a signature, submit KYC, register an identity, or broadcast a transaction:

```bash
npm run inspect:eas -- <EAS_ADDRESS> <ATTESTATION_UID>
npm run inspect:agent -- <IDENTITY_REGISTRY> <AGENT_ID>
```

Unsupported methods are reported as unsupported. Never guess contract addresses or publish private configuration.
