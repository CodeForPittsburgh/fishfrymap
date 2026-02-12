const { test, expect } = require("@playwright/test");
const { waitForSidebarData, openFilterModal } = require("./helpers");

test("filter state toggles and persists in sidebar CTA", async ({ page }) => {
  await page.goto("/");
  await waitForSidebarData(page);

  await openFilterModal(page);
  await expect(page.getByText("Find those Fish Fries!")).toBeVisible();

  await page.locator("input#publish").check();
  await page.getByRole("button", { name: "Find those Fish Fries!" }).click();

  await expect(page.locator("#filterSidebar-btn")).toContainText("Filtered");
  await expect(page.locator("#filterSidebar-btn")).toHaveClass(/btn-primary/);

  await page.locator("#filterSidebar-btn").click();
  await page.locator("input#publish").uncheck();
  await page.getByRole("button", { name: "Find those Fish Fries!" }).click();

  await expect(page.locator("#filterSidebar-btn")).toContainText("Filter");
});
