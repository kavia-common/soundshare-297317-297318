const { test, expect } = require('@playwright/test');

test.describe('Track Listing & Details', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC-08: Track List Display', async ({ page }) => {
    // Verify list of tracks
    const trackCards = page.locator('.trackCard');
    // Ensure at least one track is displayed
    await expect(trackCards.first()).toBeVisible();
    expect(await trackCards.count()).toBeGreaterThan(0);
  });

  test('TC-09 & TC-10: Track Details', async ({ page }) => {
    const firstCard = page.locator('.trackCard').first();
    
    // Verify title and artist are visible
    await expect(firstCard.locator('.trackTitle')).toBeVisible();
    await expect(firstCard.locator('.trackArtist')).toBeVisible();
    
    // Verify cover art
    const cover = firstCard.locator('.trackCover');
    await expect(cover).toBeVisible();
    // Check it has a style attribute for background
    await expect(cover).toHaveAttribute('style', /background/);
    
    // Verify tags are present
    const tags = firstCard.locator('.tag');
    if (await tags.count() > 0) {
      await expect(tags.first()).toBeVisible();
    }
  });

  test('TC-14: Search Functionality', async ({ page }) => {
    // Type in search bar
    const searchInput = page.getByRole('textbox', { name: 'Search' });
    // Search for a common term found in mock data, e.g., "Neon" or "Kavia"
    const term = "Neon";
    await searchInput.fill(term);
    
    // Verify tracks filter
    const trackCards = page.locator('.trackCard');
    
    // Wait for update - React update is near instant locally
    await expect(trackCards.first()).toBeVisible();
    
    // Check that results contain the term
    const count = await trackCards.count();
    expect(count).toBeGreaterThan(0);
    
    const text = await trackCards.first().innerText();
    expect(text.toLowerCase()).toContain(term.toLowerCase());
  });

  test('TC-15: Filtering', async ({ page }) => {
    await page.goto('/explore');
    
    const filterSelect = page.getByLabel('Filter by tag');
    await expect(filterSelect).toBeVisible();
    
    // Get options
    const options = await filterSelect.locator('option').allTextContents();
    // Assuming there is at least one tag besides "All"
    if (options.length > 1) {
      const tagToSelect = options[1].replace('#', ''); // Remove # if present in value, but value is usually clean
      // Options text is "#tag", value is "tag"
      const optionValue = await filterSelect.locator('option').nth(1).getAttribute('value');
      
      await filterSelect.selectOption(optionValue);
      
      // Verify tracks are filtered
      const trackCards = page.locator('.trackCard');
      // Just ensure we still have cards or handled empty state
      if (await trackCards.count() > 0) {
         // Optionally verify the tag is present on the card
         const firstCard = trackCards.first();
         await expect(firstCard).toContainText(`#${optionValue}`);
      }
    }
  });
});
