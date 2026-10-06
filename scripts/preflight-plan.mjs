import { isAddress, getAddress } from 'ethers';

/**
 * Local, side-effect-free policy plan. This is intentionally not a transaction
 * preflight: it does not call a wallet, mutate PCL, or broadcast anything.
 */
export function buildPreflightPlan({ target, amount, allowedTargets = [], maxAmount }) {
  if (!isAddress(target)) throw new Error('target must be a valid EVM address.');
  const normalizedTarget = getAddress(target);
  const numericAmount = BigInt(amount);
  const numericMax = BigInt(maxAmount);
  if (numericAmount < 0n) throw new Error('amount must be non-negative.');
  if (numericMax < 0n) throw new Error('maxAmount must be non-negative.');
  const allowlist = allowedTargets.map((entry) => getAddress(entry));
  const targetAllowed = allowlist.length === 0 || allowlist.some((entry) => entry === normalizedTarget);
  const amountAllowed = numericAmount <= numericMax;
  return {
    target: normalizedTarget,
    amount: numericAmount.toString(),
    maxAmount: numericMax.toString(),
    checks: { targetAllowed, amountAllowed },
    decision: targetAllowed && amountAllowed ? 'ALLOW' : 'REJECT',
    execution: 'PLAN_ONLY_NO_SIGN_NO_BROADCAST',
  };
}

if (process.argv[1]?.endsWith('/preflight-plan.mjs')) {
  const [target, amount = '0', maxAmount = '0'] = process.argv.slice(2);
  try {
    console.log(JSON.stringify(buildPreflightPlan({ target, amount, maxAmount }), null, 2));
  } catch (error) {
    console.error(`Preflight plan failed: ${error.message}`);
    process.exitCode = 1;
  }
}
