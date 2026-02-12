const { test, expect } = require("@playwright/test");
const { waitForSidebarData } = require("./helpers");

test("desktop sidebar hide/show controls work", async ({ page }) => {
  await page.goto("/");
  await waitForSidebarData(page);

  await expect(page.locator("#sidebar")).toBeVisible();

  await page.locator("#sidebar-hide-btn").click();
  await expect(page.locator("#sidebar")).toBeHidden();

  await page.locator("#list-btn").click();
  await expect(page.locator("#sidebar")).toBeVisible();
});
