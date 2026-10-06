# Project Status

Last reviewed: 2026-10-06

## Verified in the original testnet experiment

- Connected a test wallet to Maroo Testnet (chain ID `450815`).
- Deployed a minimal `MarooAirdropTest` contract.
- Called `recordActivity(1)` successfully once; the contract counter read `1` afterward.
- Built a local browser prototype for wallet connection, a mock payment preflight, and PCL exploration.
- The historical testnet deployment used an earlier, simpler source revision than the current teaching contract; the current source must be deployed and verified separately if bytecode/source correspondence is needed.

Account identifiers, deployment address, and transaction hashes are deliberately omitted. The chain itself is public; omitting them here does **not** erase or anonymize existing on-chain records.

## Not verified / not completed

- The PCL proxy deployment attempt reverted.
- No registered PCL proxy was confirmed for this experiment.
- No denylist policy was installed for this experiment.
- No regulated-path activity call was confirmed for this experiment.
- The browser-only payment guardrail is a prototype check; it is not PCL enforcement.
- The new PCL deployment and denylist scripts have not been executed against Maroo Testnet.
- Automated `npm test` verifies Solidity compilation/ABI and the read-only inspector against mocked RPC responses; it is not an on-chain EVM/PCL enforcement test.

## Reward status

No official points or airdrop rule was identified while preparing this repository. Nothing here implies eligibility or a promise of future rewards. Check Maroo's official website and documentation for current announcements.

## Current local checks

- `npm test`: passed (Solidity compile/ABI plus mocked PCL inspector tests).
- `npm run compile`: passed.
- Testnet PCL deployment/policy execution: not run; signing would publicly expose the sending wallet's activity.

## Builder tracks added

- Added a read-only RPC health check for chain ID, latest block, gas data, and optional EAS/ERC-8004/Agent surface bytecode.
- Added a side-effect-free local preflight plan enforcing amount caps and optional target allowlists.
- Added documented read-only boundaries for EAS KYC/KYB attestations and ERC-8004 agent identity.
- Added a MAWS spending-policy example requiring preflight and human approval before broadcast.
- Added a GitHub-ready builder guide and tests for the new surfaces.
- No new wallet, key, attestation, policy mutation, or transaction was created by these additions.

## Latest read-only verification

- `npm run inspect:network`: passed against `https://rpc-testnet.maroo.io`.
- Chain ID: `450815`.
- Latest block observed: `20036725`.
- Gas price observed: `9000000000000` wei.
- `npm run inspect:pcl -- DENYLIST_POLICY`: passed; template is registered as `Denylist` with description `Denylist policy`.
- No wallet was connected and no transaction was sent during these checks.

## Live read-only testnet check

- On 2026-10-06, queried the official RPC without a wallet: chain ID `450815`; `DENYLIST_POLICY` is registered (`Denylist`, description `Denylist policy`). A lookup for the zero address correctly identifies it as an unregistered proxy.
- The live `policyTemplate` response decoded as three strings, while the current docs describe a fourth `paramSchema` field. The inspector supports both response shapes; the policy setup script checks registration without assuming a return layout.
- No transaction was sent as part of this check.
