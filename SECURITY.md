# Security policy

This repository is an educational testnet project. It must never receive a
mainnet key, real funds, seed phrase, or production credential.

## Reporting a problem

Do not open a public issue containing secrets, wallet addresses tied to a
private identity, or exploit details that could affect a live service. Remove
the secret locally, rotate or abandon the affected test key, and contact the
maintainer privately through the repository's configured security channel.

## Safe defaults

- `.env` is ignored by Git.
- Read-only scripts do not load signing keys.
- PCL checks are simulated or performed with `eth_call` unless a separate
  write workflow is explicitly invoked.
- The MAWS example is policy data only; it does not initialize a wallet.
