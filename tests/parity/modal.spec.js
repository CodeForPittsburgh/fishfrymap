const { test, expect } = require("@playwright/test");
const { waitForSidebarData } = require("./helpers");

test("about modal opens from nav", async ({ page }) => {
  await page.goto("/");
  await page.locator("#about-btn").click();
  await expect(page.getByText("About the Pittsburgh Lenten Fish Fry Map")).toBeVisible();
  await page.keyboard.press("Escape");
});

test("feature modal opens from sidebar row click", async ({ page }) => {
  await page.goto("/");
  await waitForSidebarData(page);

  const firstRow = page.locator("#feature-list tbody tr").first();
  await firstRow.click();

  await expect(page.locator("#feature-title")).toBeVisible({ timeout: 10000 });
  await expect(page.getByText("Get directions")).toBeVisible();

  await page.locator(".modal.show").getByRole("button", { name: "Close" }).last().click();
});
