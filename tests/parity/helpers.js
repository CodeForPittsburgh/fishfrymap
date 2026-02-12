const { expect } = require("@playwright/test");

async function waitForSidebarData(page, minRows = 1) {
  await expect(page.locator("#map")).toBeVisible();
  await expect
    .poll(async () => {
      return page.locator("#feature-list tbody tr").count();
    }, { timeout: 30000 })
    .toBeGreaterThanOrEqual(minRows);
}

async function openFilterModal(page) {
  const sidebarFilterButton = page.locator("#filterSidebar-btn");
  if (await sidebarFilterButton.count()) {
    await sidebarFilterButton.click();
    return;
  }

  await page.locator("#nav-btn").click();
  await page.locator("#filterNav-btn").click();
}

module.exports = {
  waitForSidebarData,
  openFilterModal
};
