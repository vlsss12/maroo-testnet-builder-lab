# Maroo Builder Community Guide

This guide explains how to reproduce the public, read-only-first builder workflow in this repository. It is an independent community project and is not an official Maroo campaign.

## What this proves

The repository demonstrates:

1. RPC network verification for Maroo Testnet.
2. Solidity compilation and a minimal activity contract.
3. PCL template discovery and side-effect-free preflight.
4. Optional EAS attestation inspection by UID.
5. Optional ERC-8004-style Agent identity inspection.
6. A documented MAWS policy example that does not initialize a wallet.

This is builder evidence, not proof of airdrop eligibility. Maroo has not published a guaranteed airdrop, points formula, snapshot date, or reward allocation in the official sources reviewed for this guide.

## Safe setup

Requirements: Node.js 20+ and npm.

    git clone https://github.com/vlsss12/maroo-testnet-builder-lab.git
    cd maroo-testnet-builder-lab
    npm install
    npm test
    npm run compile
    npm run inspect:network
    npm run audit:readonly

The read-only commands do not require a private key, wallet connection, .env file, signature, faucet request, or transaction.

## PCL audit

The audit checks these documented identifiers:

- EAS_POLICY
- DENYLIST_POLICY
- VOLUME_POLICY
- PERIODIC_VOLUME_POLICY
- AGENT_OKRW_TRANSFER_LIMIT_POLICY

An unavailable template is reported as unavailable. Do not infer that a policy is live or registered without an on-chain read.

## Optional EAS and Agent reads

Only use contract addresses published by official Maroo documentation:

    npm run inspect:eas -- <EAS_ADDRESS> <ATTESTATION_UID>
    npm run inspect:agent -- <IDENTITY_REGISTRY> <AGENT_ID>

Both tools use eth_call only. Unsupported methods are reported without signing or broadcasting.

## Privacy checklist

Before sharing a fork, screenshot, log, or pull request:

- Confirm that .env and private keys are not present.
- Search for personal names, email addresses, seed phrases, and wallet addresses.
- Do not publish deployer addresses or transaction hashes if they link activity to a private identity.
- Do not copy secrets into GitHub Issues, Actions logs, README files, or screenshots.
- Treat testnet assets as having no monetary value.

## Official references

- Maroo Testnet access: https://docs.maroo.io/resources/network/testnet-access
- Maroo PCL dual-track model: https://docs.maroo.io/concepts/compliance/pcl-dual-track-model
- Maroo Agent Hub: https://agent.maroo.io/
- Maroo Testnet explorer: https://explorer-testnet.maroo.io/

## Important limitation

No activity can guarantee an airdrop. Prefer meaningful, reproducible builder work over repetitive transactions or automation. Re-check official Maroo announcements for any future points, eligibility, snapshot, builder, grant, or campaign rules.