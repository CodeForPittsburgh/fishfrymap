const { test, expect } = require("@playwright/test");
const { waitForSidebarData } = require("./helpers");

test("fishfry search suggestions open and selecting one opens feature modal", async ({ page }) => {
  await page.goto("/");
  await waitForSidebarData(page);

  const firstName = (await page.locator("#feature-list .feature-row .feature-name").first().innerText()).trim();
  const query = firstName.slice(0, Math.min(5, firstName.length));

  await page.locator("#searchbox").fill(query);
  await expect(page.getByText("Fish Frys")).toBeVisible();

  await page.locator(".tt-suggestion").first().click();
  await expect(page.locator("#feature-title")).toBeVisible({ timeout: 10000 });
});

test("nonsense search shows no results fallback", async ({ page }) => {
  await page.goto("/");
  await page.locator("#searchbox").fill("ab");
  await expect(page.getByText("Fish Frys")).toHaveCount(0);
  await expect(page.locator(".tt-dropdown-menu")).toHaveCount(0);
});
