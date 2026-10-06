# Contributing

Thanks for helping improve this Maroo builder lab.

## Ground rules

- Keep examples reproducible and testnet-only.
- Do not commit `.env`, private keys, seed phrases, OAuth tokens, wallet
  exports, or personal identifiers.
- Prefer read-only RPC calls and mocked tests.
- Every write-capable script must state its chain, target, value, and approval
  boundary before it can be considered for inclusion.
- Do not add automation that repeatedly calls Maroo services or submits
  transactions.

## Local checks

```bash
npm ci
npm test
npm run compile
npm run inspect:network
```

The network inspection is read-only. It is safe to run without a wallet.

## Pull requests

Explain the Maroo documentation version or URL used, include tests for new
decoders/validators, and clearly separate simulated, read-only, and signed
flows. Never claim airdrop eligibility unless Maroo publishes an official
rule that supports the claim.
