const { test, expect } = require("@playwright/test");

test.describe("SoundShare - smoke", () => {
  test("homepage loads and shows core UI", async ({ page }) => {
    await page.goto("/");

    // App brand should appear in the sidebar
    await expect(page.getByText("SoundShare")).toBeVisible();

    // Top search input should be present
    await expect(page.getByRole("textbox", { name: "Search" })).toBeVisible();

    // Core navigation should exist
    await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Explore" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Library" })).toBeVisible();
  });
});
