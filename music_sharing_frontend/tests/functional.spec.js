const { test, expect } = require("@playwright/test");
const { readCsvRecords } = require("./utils/csv");

test.describe("CSV-driven Functional Scenarios", () => {
  const records = readCsvRecords("data/functional_scenarios.csv");

  for (const record of records) {
    // Handle potential casing issues from CSV parser
    const testCaseId = record.testCaseId || record.testcaseid;
    const featureModule = record.featureModule || record.featuremodule;
    const testDescription = record.testDescription || record.testdescription;
    const expectedResult = record.expectedResult || record.expectedresult;
    
    const title = `[${testCaseId}] ${featureModule}: ${testDescription}`;

    test(title, async ({ page, isMobile }) => {
      // Common setup if needed
      if (testCaseId !== 'TC-16') {
        // Most tests start at home
        await page.goto('/');
      }

      switch (testCaseId) {
        case 'TC-01': // Homepage loads
          await expect(page.locator('.brandName')).toHaveText('SoundShare');
          break;

        case 'TC-02': // Nav bar
          if (isMobile) {
            test.skip(isMobile, 'Sidebar hidden on mobile');
          }
          await expect(page.locator('aside.sidebar')).toBeVisible();
          await expect(page.locator('a[href="/"]')).toBeVisible();
          await expect(page.locator('a[href="/explore"]')).toBeVisible();
          await expect(page.locator('a[href="/library"]')).toBeVisible();
          break;

        case 'TC-03': // Search bar
          await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
          await page.locator('input[placeholder*="Search"]').fill('Test');
          await expect(page.locator('input[placeholder*="Search"]')).toHaveValue('Test');
          break;

        case 'TC-04': // Playback start
          await page.locator('.trackCard .btn-primary').first().click();
          await expect(page.locator('.playBtn')).toHaveText('⏸');
          break;

        case 'TC-05': // Play/Pause toggle
          await page.locator('.trackCard .btn-primary').first().click();
          await expect(page.locator('.playBtn')).toHaveText('⏸');
          await page.locator('.playBtn').click();
          await expect(page.locator('.playBtn')).toHaveText('▶');
          break;
        case 'TC-06': // Progress bar
          await expect(page.locator('.seekWrap')).toBeVisible();
          await expect(page.locator('.seekTime').first()).toBeVisible();
          break;

        case 'TC-07': // Volume control
          await expect(page.locator('.volRange')).toBeVisible();
          await page.locator('.volRange').fill('0.5');
          break;

        case 'TC-08': // Track listing
          await expect(page.locator('.trackCard')).toHaveCount(await page.locator('.trackCard').count());
          const count = await page.locator('.trackCard').count();
          expect(count).toBeGreaterThan(0);
          break;

        case 'TC-09': // Track detail
          await page.locator('button[aria-label*="Share"]').first().click();
          await expect(page.locator('.sheet')).toBeVisible();
          await expect(page.locator('.sheetTitle')).toHaveText('Share');
          break;

        case 'TC-10': // Track details content
          const card = page.locator('.trackCard').first();
          await expect(card.locator('.trackTitle')).toBeVisible();
          await expect(card.locator('.trackArtist')).toBeVisible();
          await expect(card.locator('.trackDuration')).toBeVisible();
          break;
        case 'TC-11': // Like track
          const firstCard = page.locator('.trackCard').first(); const likeBtn = firstCard.locator('.trackActions button').last();
          await likeBtn.click();
          await expect(likeBtn).toHaveClass(/isLiked/);
          break;

        case 'TC-12': // Follow artist
          test.skip(true, 'Follow artist feature not implemented in frontend yet');
          break;

        case 'TC-13': // Upload
          test.skip(true, 'Upload feature not implemented in frontend yet');
          break;

        case 'TC-14': // Search results
          const searchInput = page.locator('input[placeholder*="Search"]');
          await searchInput.fill('Neon');
          await expect(page.locator('.trackTitle').first()).toContainText('Neon');
          break;

        case 'TC-15': // Filter
          await page.goto('/explore');
          await page.locator('select[aria-label="Filter by tag"]').selectOption('electronic');
          await expect(page.locator('.tag').first()).toHaveText('#electronic');
          break;

        case 'TC-16': // Responsiveness
          await page.setViewportSize({ width: 375, height: 667 });
          await page.goto('/');
          await expect(page.locator('.sidebar')).toBeHidden();
          await expect(page.locator('.topbar')).toBeVisible();
          break;

        case 'TC-17': // Error handling
          test.skip(true, 'Error simulation requires network mocking not set up in this suite');
          break;

        case 'TC-18': // Broken images
          test.skip(true, 'Visual regression or broken image detection skipped');
          break;

        default:
          test.skip(true, `Test implementation for ${testCaseId} not found`);
      }
    });
  }
});
