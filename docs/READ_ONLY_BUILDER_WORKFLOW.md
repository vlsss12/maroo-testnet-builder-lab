# Read-only Builder Workflow

This workflow turns Maroo's official Testnet surfaces into reproducible builder evidence without exposing a wallet or sending a transaction.

## 1. Verify the network

Use the official Testnet RPC:

- RPC: https://rpc-testnet.maroo.io
- Chain ID: 450815
- Explorer: https://explorer-testnet.maroo.io
- Indexer: https://explorer-testnet.maroo.io/blockscout/api/v2

Run:

    npm run inspect:network
    npm run audit:readonly

The audit checks the network and the documented PCL template identifiers. A failed or unavailable read is recorded as a finding; it is not silently treated as success.

## 2. Run the Solidity path

Compile the example contract and inspect its ABI:

    npm run compile
    npm test

Deployment and recording are optional state-changing exercises. They are not required for the read-only workflow and must never be run with an undisclosed or production key.

## 3. Run the viem path

The repository includes examples/viem-readonly.mjs. It uses createPublicClient, the Maroo Testnet chain definition, and readContract only.

Install the optional example dependency locally:

    npm install --no-save viem
    node examples/viem-readonly.mjs

The example verifies chain ID, reads the latest block, and reads DENYLIST_POLICY metadata from the PCL precompile. It does not create a wallet client.

## 4. EAS/KYC mock boundary

The official Testnet documentation exposes a mock KYC service and EAS-related policy surfaces. The repository's inspect:eas command is an attestation reader, not a KYC submission tool:

    npm run inspect:eas -- <EAS_ADDRESS> <ATTESTATION_UID>

Only use addresses and schemas published by official Maroo documentation. Never submit personal identity data to an unverified endpoint.

## 5. ERC-8004 Agent boundary

The inspect:agent command probes common identity-registry methods with eth_call:

    npm run inspect:agent -- <IDENTITY_REGISTRY> <AGENT_ID>

Unsupported methods are returned as diagnostics. The command does not register an Agent, mint an identity, or change state.

## 6. PCL decision evidence

For every policy experiment, record:

- chain ID and RPC endpoint
- template identifier
- returned template metadata
- proxy registration result, if applicable
- preflight decision and reason
- timestamp
- whether the operation was read-only or state-changing

Do not record private keys, seed phrases, personal emails, or wallet addresses linked to a private identity.

## 7. Reward and airdrop boundary

This workflow is useful builder evidence, not an eligibility claim. Maroo has not published a guaranteed airdrop, points formula, snapshot date, or allocation rule in the official sources reviewed. Repetitive transactions, multi-wallet farming, and automation are not substitutes for meaningful development.
