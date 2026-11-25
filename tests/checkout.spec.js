const { test, expect } = require("@playwright/test");

test.describe("Mini checkout", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("empty cart keeps checkout disabled and shows guidance until product is added", async ({ page }) => {
    const checkoutButton = page.getByTestId("checkout-button");
    await expect(checkoutButton).toBeDisabled();
    await expect(page.getByTestId("empty-cart-hint")).toHaveText(
      "Add at least one product to your cart before placing an order."
    );

    await page.getByTestId("add-aurora-pen-set").click();

    await expect(checkoutButton).toBeEnabled();
    await expect(page.getByTestId("empty-cart-hint")).toHaveText("");
  });

  test("successful checkout shows confirmation and order reference", async ({ page }) => {
    await page.getByTestId("add-nimbus-notebook").click();
    await page.getByTestId("customer-name").fill("Anaya Sharma");
    await page.getByTestId("checkout-button").click();

    const confirmation = page.getByTestId("confirmation");
    await expect(confirmation).toBeVisible();
    await expect(confirmation).toContainText("Order placed successfully");
    await expect(confirmation).toContainText(/Reference: FYND-[A-Z0-9-]+/);
  });

  test("missing customer name blocks checkout and shows validation", async ({ page }) => {
    await page.getByTestId("add-aurora-pen-set").click();
    await page.getByTestId("checkout-button").click();

    await expect(page.getByTestId("name-error")).toContainText("Customer name is required");
    await expect(page.getByTestId("confirmation")).toHaveText("");
  });

  test("changing quantity updates exact expected order total", async ({ page }) => {
    await page.getByTestId("add-nimbus-notebook").click();
    await expect(page.getByTestId("order-total")).toHaveText("₹249.50");

    await page.getByTestId("increase-nimbus-notebook").click();
    await page.getByTestId("increase-nimbus-notebook").click();

    await expect(page.getByTestId("qty-nimbus-notebook")).toHaveText("3");
    await expect(page.getByTestId("line-total-nimbus-notebook")).toHaveText("₹748.50");
    await expect(page.getByTestId("order-total")).toHaveText("₹748.50");
  });
});
