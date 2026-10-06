# Maroo agent identity track

This folder documents the read-only integration boundary for Maroo's agent
identity surfaces. Maroo documents ERC-8004 Identity Registry and an Agent
precompile for discovery and indexed reads. Canonical addresses and ABIs must
come from Maroo's current official deployed-contracts reference; they are not
hard-coded here because interfaces can change.

## Safe workflow

1. Read the current network and deployed-contract pages.
2. Configure optional addresses in local `.env` only for read-only inspection:
   `ERC8004_IDENTITY_REGISTRY` and `AGENT_PRECOMPILE`.
3. Run `npm run inspect:network` to verify chain ID and bytecode presence.
4. Use the official ABI and perform `eth_call` reads only.
5. Never put a private key in this folder or in GitHub.

Registration, ownership changes, and attestations are writes and are outside
this read-only lab until a separately reviewed workflow exists.
