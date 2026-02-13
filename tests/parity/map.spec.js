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

test("overlay toggle hides and restores sidebar rows", async ({ page }) => {
  await page.goto("/");
  await waitForSidebarData(page);

  const layersControl = page.locator(".leaflet-control-layers");
  await layersControl.hover();

  const overlayToggle = layersControl
    .locator(".leaflet-control-layers-overlays label", { hasText: "Fish Fries" })
    .locator("input[type='checkbox']");

  await expect(overlayToggle).toBeVisible();

  await expect(overlayToggle).toBeChecked();

  await overlayToggle.uncheck({ force: true });
  await expect(overlayToggle).not.toBeChecked();
  await expect
    .poll(async () => {
      return page.locator("#feature-list .feature-row").count();
    })
    .toBe(0);

  await overlayToggle.check({ force: true });
  await expect(overlayToggle).toBeChecked();
  await waitForSidebarData(page);
});

test("basemap control switches active basemap thumbnail", async ({ page }) => {
  await page.goto("/");
  await waitForSidebarData(page);

  const activeBasemap = page.locator(".basemaps .basemap.active img");
  const altBasemap = page.locator(".basemaps .basemap.alt").first();

  const beforeSrc = await activeBasemap.getAttribute("src");
  await altBasemap.click();

  await expect
    .poll(async () => {
      return page.locator(".basemaps .basemap.active img").first().getAttribute("src");
    })
    .not.toBe(beforeSrc);
});

test("sidebar rows resync after map moveend from feature focus", async ({ page }) => {
  await page.goto("/");
  await waitForSidebarData(page, 2);

  const initialRows = await page.locator("#feature-list .feature-row").count();
  await page.locator("#feature-list .feature-row").first().click();
  await expect(page.locator("#feature-title")).toBeVisible({ timeout: 10000 });

  await expect
    .poll(async () => {
      return page.locator("#feature-list .feature-row").count();
    })
    .not.toBe(initialRows);
});

test("marker cluster layer stays active across zoom changes", async ({ page }) => {
  await page.goto("/");
  await waitForSidebarData(page);

  await expect
    .poll(async () => {
      return (
        (await page.locator(".marker-cluster").count()) +
        (await page.locator(".leaflet-marker-icon").count())
      );
    })
    .toBeGreaterThan(0);

  await page.locator(".leaflet-control-zoomhome-in").click();
  await page.locator(".leaflet-control-zoomhome-in").click();
  await page.locator(".leaflet-control-zoomhome-out").click();

  await expect
    .poll(async () => {
      return (
        (await page.locator(".marker-cluster").count()) +
        (await page.locator(".leaflet-marker-icon").count())
      );
    })
    .toBeGreaterThan(0);
});
