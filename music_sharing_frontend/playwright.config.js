/* eslint-disable no-undef */
/**
 * Playwright Test configuration for SoundShare frontend.
 * - Runs against the CRA dev server (port 3000).
 * - Produces HTML reports and retains artifacts on failure for debugging.
 */

const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

  // HTML report (open manually via `npm run test:report`)
  reporter: [["html", { open: "never" }]],

  // Where Playwright stores output artifacts (screenshots, traces, etc.)
  outputDir: "test-results",

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  // Start the dev server automatically for tests.
  // `BROWSER=none` prevents CRA from trying to open a browser window.
  webServer: {
    command: "cross-env BROWSER=none PORT=3000 npm start",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },

  // Recommended browsers (Chromium, Firefox, WebKit)
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
