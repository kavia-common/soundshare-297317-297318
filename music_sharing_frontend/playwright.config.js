const { defineConfig, devices } = require("@playwright/test");

/**
 * Playwright configuration for SoundShare frontend E2E testing.
 *
 * Notes:
 * - Tests are data-driven via CSV (see tests/data/*.csv and tests/utils/csv.js).
 * - The dev server is started automatically for `npm run test:e2e`.
 * - HTML report is generated under `playwright-report/`.
 */
module.exports = defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },

  // Keep CI resilient and non-flaky by retrying on CI.
  retries: process.env.CI ? 2 : 0,

  // HTML report is the requested "stepwise HTML reports" baseline. Tests also attach
  // screenshots automatically on failure via Playwright settings below.
  reporter: [["html", { open: "never" }]],

  use: {
    // For CRA app
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",

    // Artifacts for debugging failures
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
  },

  // Start CRA dev server automatically for e2e runs.
  webServer: {
    command: "npm start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },

  projects: [
    // Keep default to Chromium for speed and consistency, but allow easy extension.
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
