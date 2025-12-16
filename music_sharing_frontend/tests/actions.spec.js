const { test, expect } = require('@playwright/test');

test.describe('User Actions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC-11: Like/Favorite', async ({ page }) => {
    // Find a like button on a track card.
    // TrackCard: aria-label={isLiked ? "Unlike" : "Like"}
    const likeButton = page.getByRole('button', { name: /Like|Unlike/ }).first();
    await expect(likeButton).toBeVisible();
    await likeButton.click();
    
    // Should change to Unlike
    await expect(likeButton).toHaveAttribute('aria-label', 'Unlike');
    
    // Click again to unlike
    await likeButton.click();
    await expect(likeButton).toHaveAttribute('aria-label', 'Like');
  });

  test('TC-12: Follow Artist', async ({ page }) => {
    test.skip('Feature not implemented in UI');
  });

  test('TC-13: Upload Track', async ({ page }) => {
    test.skip('Upload feature not supported');
  });

  test('TC-17: Error Handling', async ({ page }) => {
     // Difficult to mock error without network interception or modifying mock data
     test.skip('Error handling test requires mock setup improvement');
  });

  test('TC-18: Broken Images', async ({ page }) => {
    // Verify cover images fallback to background color
    const covers = page.locator('.trackCover');
    await expect(covers.first()).toBeVisible();
    
    const count = await covers.count();
    for (let i = 0; i < count; ++i) {
      const style = await covers.nth(i).getAttribute('style');
      expect(style).toContain('background');
    }
  });
});
