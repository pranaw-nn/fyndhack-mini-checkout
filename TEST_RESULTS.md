# Test Results

## Automated (Playwright)

Status: Executed on 2026-11-25 (quality-improvement regression run).

Command used:

```bash
npm run test:e2e
```

Observed output summary:

- 4 tests run.
- 4 tests passed.
- 0 tests failed.
- 0 tests skipped.
- Total runtime: approximately 2.5 seconds.

Covered automated checks:

1. Empty cart keeps checkout disabled and shows empty-cart guidance; adding an item enables checkout.
2. Successful checkout produces visible confirmation and order reference.
3. Missing customer name blocks checkout and displays validation.
4. Quantity changes update the expected order total.

## Manual

Status: Not executed in this run.

Planned checks:

1. Empty cart checkout validation.
2. Checkout disabled when cart is empty.
3. Rapid double-click creates a single confirmation.
4. Name input preserved after failed validation.
5. Decrement-from-one removes item.
