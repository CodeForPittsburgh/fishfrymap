const { test, expect } = require("@playwright/test");

test("app shell loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#map")).toBeVisible();
  await expect(page.locator("#searchbox")).toBeVisible();
});

test("legacy fallback route is available", async ({ page }) => {
  await page.goto("/?legacy=1");
  await expect(page).toHaveURL(/legacy\.html/);
  await expect(page.locator("#map")).toBeVisible();
  await expect(page.locator("#feature-list")).toHaveCount(1);
});

test("filter modal opens", async ({ page }) => {
  await page.goto("/");
  await page.locator("#filterSidebar-btn").click();
  await expect(page.getByText("Find those Fish Fries!")).toBeVisible();
});
