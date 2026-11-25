# FyndHack Mini Checkout

Single-page checkout app built with HTML, CSS, and vanilla JavaScript. Browser automation is implemented with Playwright Test.

## Features

- Two synthetic products with fixed INR prices.
- Add, remove, increase, and decrease cart quantities.
- Quantity per product is capped at 99.
- Line totals and order total.
- Monetary calculations done in integer paise.
- Required customer name validation.
- Checkout blocked for empty cart or missing name.
- Empty-cart guidance appears near Place Order until at least one item is added.
- Unique order reference on successful checkout.
- Duplicate submit prevention via submit lock and disabled checkout state.

## Prerequisites

- Node.js 18+

## Setup

```bash
npm install
npx playwright install chromium
```

## Run the application

```bash
npm run start
```

Open: `http://127.0.0.1:4173`

## Run automated browser tests

```bash
npm run test:e2e
```

## Project structure

- `index.html` - semantic UI structure and test hooks.
- `styles.css` - responsive styling.
- `app.js` - checkout state, validation, and checkout business logic.
- `server.js` - local static file server.
- `tests/checkout.spec.js` - Playwright browser tests.
- `TEST_PLAN.md` - risks and test coverage.
- `TEST_RESULTS.md` - automated and manual execution results.
