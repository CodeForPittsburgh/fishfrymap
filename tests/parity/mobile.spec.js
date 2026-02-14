const { test, expect } = require("@playwright/test");
const { waitForSidebarData } = require("./helpers");

test.describe("mobile parity", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("mobile footer filter/search and sidebar interactions work", async ({ page }) => {
    await page.goto("/");
    await waitForSidebarData(page);

    await expect(page.locator("#mobile-footer")).toBeVisible();
    await expect(page.locator("#mobile-nearby-btn")).toBeDisabled();
    await expect(page.locator("#sidebar")).toBeHidden();

    await page.locator("#mobile-filter-btn").click();
    await expect(page.getByText("Find those Fish Fries!")).toBeVisible();
    await page.getByRole("button", { name: "Find those Fish Fries!" }).click();

    await page.locator("#mobile-venues-btn").click();
    await expect(page.locator("#sidebar")).toBeVisible();
    await expect(page.locator("#mobile-footer")).toBeHidden();

    const firstName = (await page.locator("#feature-list .feature-row .feature-name").first().innerText()).trim();
    const query = firstName.slice(0, Math.min(5, firstName.length));

    await page.locator("#sidebar-hide-btn").click();
    await expect(page.locator("#sidebar")).toBeHidden();
    await expect(page.locator("#mobile-footer")).toBeVisible();

    await page.locator("#mobile-searchbox").fill(query);
    await expect(page.locator("#mobile-footer .typeahead-header", { hasText: "Fish Frys" })).toBeVisible();

    await page.locator("#mobile-footer .tt-suggestion").first().click();
    await expect(page.locator("#feature-title")).toBeVisible({ timeout: 10000 });
  });
});
