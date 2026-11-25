const { chromium } = require("playwright");
const path = require("path");

async function run() {
  const browser = await chromium.launch({ headless: true });

  const scenarioAContext = await browser.newContext();
  const pageA = await scenarioAContext.newPage();
  await pageA.goto("http://127.0.0.1:4173/");
  const checkoutDisabledAtStart = await pageA.getByTestId("checkout-button").isDisabled();
  if (!checkoutDisabledAtStart) {
    await pageA.getByTestId("checkout-button").click();
  }

  const scenarioA = {
    cartError: (await pageA.getByTestId("cart-error").textContent())?.trim() || "",
    nameError: (await pageA.getByTestId("name-error").textContent())?.trim() || "",
    confirmation: (await pageA.getByTestId("confirmation").textContent())?.trim() || "",
    checkoutDisabled: checkoutDisabledAtStart,
    clickAttempted: !checkoutDisabledAtStart
  };

  const scenarioAShot = path.join(__dirname, "..", "evidence", "manual-A-empty-cart.png");
  await pageA.screenshot({ path: scenarioAShot, fullPage: true });
  await scenarioAContext.close();

  const scenarioBContext = await browser.newContext();
  const pageB = await scenarioBContext.newPage();
  await pageB.goto("http://127.0.0.1:4173/");
  await pageB.getByTestId("add-nimbus-notebook").click();
  await pageB.getByTestId("customer-name").fill("Riya Kapoor");

  await Promise.all([
    pageB.getByTestId("checkout-button").click(),
    pageB.getByTestId("checkout-button").click()
  ]);

  const confirmationText = (await pageB.getByTestId("confirmation").textContent())?.trim() || "";
  const scenarioB = {
    confirmationText,
    hasOrderReference: /Reference: FYND-[A-Z0-9-]+/.test(confirmationText),
    confirmationElementsWithText: await pageB.evaluate(() => {
      return Array.from(document.querySelectorAll("[data-testid='confirmation']")).filter((el) =>
        Boolean(el.textContent && el.textContent.trim())
      ).length;
    }),
    emptyCartVisible: await pageB.getByTestId("empty-cart-message").isVisible()
  };

  const scenarioBShot = path.join(__dirname, "..", "evidence", "manual-B-double-click.png");
  await pageB.screenshot({ path: scenarioBShot, fullPage: true });
  await scenarioBContext.close();

  await browser.close();

  process.stdout.write(`${JSON.stringify({ scenarioA, scenarioB }, null, 2)}\n`);
}

run().catch((error) => {
  process.stderr.write(`verification-manual-scenarios failed: ${error.stack}\n`);
  process.exit(1);
});
