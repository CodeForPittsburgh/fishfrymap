const { test, expect } = require("@playwright/test");
const { waitForSidebarData } = require("./helpers");

test.describe("mobile parity", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("sidebar toggle and mobile filter modal path work", async ({ page }) => {
    await page.goto("/");
    await waitForSidebarData(page);

    await expect(page.locator("#sidebar")).toBeHidden();

    await page.locator("#sidebar-toggle-btn").click();
    await expect(page.locator("#sidebar")).toBeVisible();

    await page.locator("#nav-btn").click();
    await page.locator("#filterNav-btn").click();
    await expect(page.getByText("Find those Fish Fries!")).toBeVisible();
  });
});
