const { test, expect } = require("@playwright/test");
const { readCsvRecords } = require("./utils/csv");

test.describe("CSV-driven smoke checks", () => {
  test("loads CSV test cases", () => {
    const rows = readCsvRecords("data/homepage_checks.csv");
    expect(rows.length).toBeGreaterThan(0);
  });

  test.describe("routes + basic UI presence", () => {
    const rows = readCsvRecords("data/homepage_checks.csv");

    for (const row of rows) {
      const caseName = row.casename || row.caseName || `${row.route} contains ${row.expecttext}`;
      const route = row.route || "/";
      const expectText = row.expecttext || row.expectText || "";

      test(`CSV: ${caseName}`, async ({ page, baseURL }) => {
        // Navigate to route
        await page.goto(new URL(route, baseURL).toString());

        // Basic check: a key piece of text exists on the page.
        // Use .first() to avoid strict mode violations if text appears in nav + title
        await expect(page.getByText(expectText, { exact: false }).first()).toBeVisible();
      });
    }
  });
});
