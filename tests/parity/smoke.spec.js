const { test, expect } = require("@playwright/test");
const { waitForSidebarData } = require("./helpers");

test("app shell loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#map")).toBeVisible();
  await expect(page.locator("#searchbox")).toBeVisible();
});

test("legacy query param is ignored and app still loads", async ({ page }) => {
  await page.goto("/?legacy=1");
  await expect(page).not.toHaveURL(/legacy\.html/);
  await expect(page.locator("#map")).toBeVisible();
  await expect(page.locator("#searchbox")).toBeVisible();
});

test("filter modal opens", async ({ page }) => {
  await page.goto("/");
  await page.locator("#filterSidebar-btn").click();
  await expect(page.getByText("Find those Fish Fries!")).toBeVisible();
});

test("falls back to local data when primary API is unreachable", async ({ page }) => {
  await page.route(/\/api\/fishfries\/?(\?.*)?$/, (route) => route.abort());
  await page.goto("/");
  await waitForSidebarData(page);
  await expect(page.getByText("Primary API is unreachable; showing fallback data.")).toBeVisible();
});
