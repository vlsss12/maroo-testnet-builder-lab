# Maroo Community Builder Guide

> This is an independent community guide. It is not an official Maroo airdrop announcement and does not guarantee points, eligibility, NFTs, tokens, or rewards.

## Goal

Use official Maroo Testnet surfaces to build useful, reproducible evidence. The strongest signal is meaningful builder work: integrations, tests, documentation, and safe technical feedback—not repetitive transactions.

## Step 0 — Safety rules

- Use only official Maroo domains linked below.
- Never paste a seed phrase, private key, wallet export, API token, or personal email into GitHub.
- Never commit `.env`; keep it local and verify `.gitignore` before every push.
- Do not use a mainnet key or real funds for Testnet experiments.
- Do not run multi-wallet farming, repetitive scripts, spam transactions, or unapproved automation.
- Do not submit real KYC or personal identity data to an endpoint unless Maroo officially documents that exact flow.

## Step 1 — Verify the official network

Official Testnet configuration:

- Chain ID: `450815`
- RPC: `https://rpc-testnet.maroo.io`
- Explorer: `https://explorer-testnet.maroo.io`
- Indexer: `https://explorer-testnet.maroo.io/blockscout/api/v2`
- Mock KYC: `https://kyc-testnet.maroo.io`

Confirm the network from the official documentation before using any address or endpoint: [Maroo Testnet Access](https://docs.maroo.io/resources/network/testnet-access/).

## Step 2 — Run the public builder lab

Requirements: Node.js 20+ and npm.

    git clone https://github.com/vlsss12/maroo-testnet-builder-lab.git
    cd maroo-testnet-builder-lab
    npm install
    npm test
    npm run compile
    npm run inspect:network
    npm run audit:readonly

These commands are read-only or local. They do not require a private key, signature, wallet connection, faucet request, or transaction.

## Step 3 — Check PCL policy surfaces

Run `npm run audit:readonly`. It checks the documented policy identifiers:

- `EAS_POLICY`
- `DENYLIST_POLICY`
- `VOLUME_POLICY`
- `PERIODIC_VOLUME_POLICY`
- `AGENT_OKRW_TRANSFER_LIMIT_POLICY`

Save only the public result: chain ID, template identifier, metadata, and timestamp. If a template is unavailable, report it as unavailable; do not claim that it is active.

## Step 4 — Try the viem integration

Maroo documents EVM-compatible tooling, including ethers, viem, Hardhat, and Foundry.

    npm install --no-save viem
    node examples/viem-readonly.mjs

The example uses `createPublicClient` and `readContract` only. It does not create a wallet client or broadcast a transaction.

## Step 5 — Inspect EAS and ERC-8004 only when addresses are official

Use contract addresses and schemas published by Maroo—not addresses copied from unverified posts.

    npm run inspect:eas -- <EAS_ADDRESS> <ATTESTATION_UID>
    npm run inspect:agent -- <IDENTITY_REGISTRY> <AGENT_ID>

Both commands use `eth_call`. They are inspection tools; they do not submit KYC, register an Agent, mint an identity, or change state.

## Step 6 — Create meaningful builder evidence

Good contributions include:

- a tested RPC or Solidity integration;
- a viem/wagmi/Foundry example;
- a PCL policy explanation with reproducible read-only output;
- a safe EAS or ERC-8004 diagnostic adapter;
- tests for wrong-chain, unsupported-method, and policy-rejection cases;
- clear installation instructions and a short technical write-up;
- bug reports with redacted logs and exact reproduction steps.

Publish code, tests, and documentation—not private activity data.

## Step 7 — If you choose to use the Testnet wallet

This is optional and not required for the read-only builder workflow. Only proceed when the action is explicitly documented by Maroo and you personally accept that public chain activity can link a wallet to your work.

Before any signed action, manually verify:

1. Chain ID is `450815`.
2. Destination and contract address came from official documentation.
3. Calldata and value are exactly expected.
4. The action has a real development purpose.
5. No script is repeating the same action unnaturally.

Never treat transaction count as proof of eligibility.

## Step 8 — Keep a private evidence log

Store locally, never in the public repository:

- dates and commands run;
- test results;
- redacted error messages;
- links to public commits and documentation;
- the reason for each meaningful experiment.

Do not store private keys, seed phrases, personal emails, private wallet labels, or unredacted screenshots.

## Step 9 — Monitor eligibility announcements

Check only official Maroo sources for `airdrop`, `points`, `snapshot`, `eligibility`, `builder rewards`, `grant`, `hackathon`, `NFT`, and `testnet` changes. Until Maroo publishes explicit rules, no community guide can promise an allocation.

## Final checklist before sharing

- [ ] `npm test` passes.
- [ ] `npm run compile` passes.
- [ ] No `.env` or secret file is tracked.
- [ ] No private key, seed phrase, personal name, email, or wallet address is present.
- [ ] All claims link to an official Maroo source or a reproducible repository file.
- [ ] The post says clearly that airdrop eligibility is unconfirmed.

## Official references

- [Maroo Testnet Access](https://docs.maroo.io/resources/network/testnet-access/)
- [PCL dual-track model](https://docs.maroo.io/concepts/compliance/pcl-dual-track-model)
- [PCL built-in policy templates](https://docs.maroo.io/concepts/compliance/pcl-policy-templates)
- [Maroo Agent Hub](https://agent.maroo.io/)
- [Maroo Testnet Explorer](https://explorer-testnet.maroo.io/)
- [Maroo Terms](https://experience.maroo.io/en/terms)