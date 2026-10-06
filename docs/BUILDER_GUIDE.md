# Maroo Builder Lab

This repository is an educational, GitHub-ready integration lab for Maroo
Testnet. It demonstrates six builder tracks without pretending that testnet
activity qualifies an account for an airdrop.

## Tracks

1. **RPC and Solidity API** — `scripts/inspect-network.mjs` checks the Maroo
   chain ID, latest block, gas data, and optional deployed surfaces using
   read-only JSON-RPC calls. `contracts/MarooAirdropTest.sol` is a minimal
   local Solidity example.
2. **PCL preflight** — `scripts/inspect-pcl.mjs` reads policy-template and
   proxy metadata. `scripts/preflight-plan.mjs` provides a local allowlist and
   amount-cap decision before any future integration call.
3. **EAS KYC/KYB** — attestations are explicit, consented writes. This
   repository documents the integration boundary but does not create an
   attestation or process identity data.
4. **ERC-8004 Agent identity** — see `agent/README.md`. Address and ABI data
   must come from Maroo's current official deployed-contracts reference.
5. **MAWS policy** — `maws/policy.example.json` shows a bounded policy with a
   one-million-OKRW cap and mandatory preflight/human approval.
6. **Public contribution** — publish source, tests, security notes, and the
   exact read/write boundary. Never publish `.env`, keys, seed phrases,
   personal names, or wallet-linked transaction history.

## Commands

```bash
npm ci
npm test
npm run compile
npm run inspect:network
npm run inspect:pcl -- DENYLIST_POLICY
npm run preflight:plan -- 0x0000000000000000000000000000000000000001 500000 1000000
```

Inspection and planning commands do not connect a wallet, sign, or broadcast.
The existing deploy and policy-mutation scripts are intentionally separate and
must never run as an automated schedule.

## EAS and identity boundary

Before implementing a write, verify the current ABI, schema UID, issuer rules,
consent requirements, and revocation behavior against Maroo's official docs.
This repo keeps that work read-only until those inputs are pinned and reviewed.

## Reward disclaimer

No official points, snapshot, or airdrop rule is asserted here. Builder work
is useful for learning and public contribution; it is not a promise of
eligibility or allocation.
