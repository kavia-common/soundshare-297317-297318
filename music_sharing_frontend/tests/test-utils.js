const { expect } = require('@playwright/test');

/**
 * Helper to start playback on the first available track.
 * @param {import('@playwright/test').Page} page
 */
async function playFirstTrack(page) {
  const playButton = page.locator('button[aria-label^="Play "]').first();
  await expect(playButton).toBeVisible();
  await playButton.click();
  
  // Wait for player dock to reflect playing state
  const dockPlayBtn = page.locator('.dock .playBtn');
  await expect(dockPlayBtn).toBeVisible();
  await expect(dockPlayBtn).toHaveAttribute('aria-label', 'Pause');
  return dockPlayBtn;
}

module.exports = {
  playFirstTrack,
};
