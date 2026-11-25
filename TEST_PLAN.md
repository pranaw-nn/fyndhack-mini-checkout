# Test Plan - FyndHack Mini Checkout

## Scope

Validate checkout behavior, monetary correctness, and protection from invalid or duplicate submissions in a frontend-only implementation.

## Prioritized risks

1. **High:** Incorrect money math due to floating-point errors.
2. **High:** Checkout submits with invalid inputs (blank name or empty cart).
3. **High:** Duplicate submissions from rapid repeated clicks.
4. **Medium:** Quantity actions fail to keep totals consistent.
5. **Medium:** Cart removal/decrement edge cases break UI state.
6. **Low:** Accessibility and semantic controls regressions.

## Automated test cases (Playwright)

1. Empty cart keeps checkout disabled and shows guidance; adding an item enables checkout.
2. Successful checkout produces visible confirmation and order reference.
3. Missing customer name blocks checkout and shows validation.
4. Quantity changes update exact expected total.

## Manual test cases

1. Empty cart state shows disabled checkout and empty-cart guidance near Place Order.
2. Removing all items keeps checkout disabled.
3. Rapid double click on checkout yields only one confirmation message and one order reference.
4. Customer name remains in input when validation fails.
5. Decrementing quantity from one removes the line item.
6. Increasing quantity beyond 99 is prevented.

## Entry/exit criteria

- Entry: App loads locally and selectors are stable.
- Exit: All automated tests pass; manual checks executed and logged in `TEST_RESULTS.md`.
