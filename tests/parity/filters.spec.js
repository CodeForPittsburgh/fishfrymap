const { test, expect } = require("@playwright/test");
const { waitForSidebarData, openFilterModal } = require("./helpers");

test("filter state toggles and persists in sidebar CTA", async ({ page }) => {
  await page.goto("/");
  await waitForSidebarData(page);
  const initialRows = await page.locator("#feature-list tbody tr").count();

  await openFilterModal(page);
  await expect(page.getByText("Find those Fish Fries!")).toBeVisible();

  await page.locator("input#publish").check();
  await page.getByRole("button", { name: "Find those Fish Fries!" }).click();

  await expect(page.locator("#filterSidebar-btn")).toContainText("Filtered");
  await expect(page.locator("#filterSidebar-btn")).toHaveClass(/btn-primary/);
  await expect
    .poll(async () => {
      return page.locator("#feature-list tbody tr").count();
    })
    .toBeLessThanOrEqual(initialRows);

  const filteredRows = await page.locator("#feature-list tbody tr").count();
  if (filteredRows > 0) {
    await page.locator("#feature-list tbody tr").first().click();
    await expect(page.locator("#feature-title")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("has not yet been verified this year")).toHaveCount(0);
    await page.locator(".modal.show").getByRole("button", { name: "Close" }).last().click();
  }

  await page.locator("#filterSidebar-btn").click();
  await page.locator("input#publish").uncheck();
  await page.getByRole("button", { name: "Find those Fish Fries!" }).click();

  await expect(page.locator("#filterSidebar-btn")).toContainText("Filter");
});

test("good friday filter can be toggled without breaking results", async ({ page }) => {
  await page.goto("/");
  await waitForSidebarData(page);
  const before = await page.locator("#feature-list tbody tr").count();

  await openFilterModal(page);
  await page.locator("input#GoodFriday").check();
  await page.getByRole("button", { name: "Find those Fish Fries!" }).click();

  await expect(page.locator("#filterSidebar-btn")).toContainText("Filtered");
  await expect
    .poll(async () => {
      return page.locator("#feature-list tbody tr").count();
    })
    .toBeLessThanOrEqual(before);

  await page.locator("#filterSidebar-btn").click();
  await page.locator("input#GoodFriday").uncheck();
  await page.getByRole("button", { name: "Find those Fish Fries!" }).click();
  await expect(page.locator("#filterSidebar-btn")).toContainText("Filter");
});
