const { test, expect } = require("@playwright/test");
const { readCsvRecords } = require("./utils/csv");

test.describe("CSV-driven smoke checks", () => {
  test("loads CSV test cases", async () => {
    const rows = await readCsvRecords("data/homepage_checks.csv");
    expect(rows.length).toBeGreaterThan(0);
  });

  // Data-driven tests: each row becomes its own Playwright test.
  test.describe("routes + basic UI presence", () => {
    /** We define tests dynamically once CSV is read. */
    test.beforeAll(async () => {
      // no-op: placeholder to keep describe block structured
    });

    // Define tests at module evaluation time by reading CSV synchronously is not ideal.
    // Instead, we wrap generation in an immediately-invoked async function and register
    // tests via test() calls.
  });
});

// Dynamic test registration (runs at import time).
(async () => {
  const rows = await readCsvRecords("data/homepage_checks.csv");

  for (const row of rows) {
    const caseName = row.caseName || `${row.route} contains ${row.expectText}`;
    const route = row.route || "/";
    const expectText = row.expectText || "";

    test(`CSV: ${caseName}`, async ({ page, baseURL }) => {
      // Navigate to route
      await page.goto(new URL(route, baseURL).toString());

      // Basic check: a key piece of text exists on the page.
      // We use getByText to keep the test stable across markup changes.
      await expect(page.getByText(expectText, { exact: false })).toBeVisible();
    });
  }
})().catch((e) => {
  // Fail fast if CSV cannot be read/parsed; Playwright will surface this on load.
  // eslint-disable-next-line no-console
  console.error(e);
  process.exitCode = 1;
});
