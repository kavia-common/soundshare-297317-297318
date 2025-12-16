const { test, expect } = require('@playwright/test');
const { playFirstTrack } = require('./test-utils');

test.describe('Audio Playback', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC-04: Start Playback', async ({ page }) => {
    // Use helper to start playback and verify it starts
    await playFirstTrack(page);
  });

  test('TC-05: Play/Pause Toggle', async ({ page }) => {
    // Start playback first
    const dockPlayBtn = await playFirstTrack(page);
    
    // Toggle Pause -> Play
    await dockPlayBtn.click();
    await expect(dockPlayBtn).toHaveAttribute('aria-label', 'Play');
    
    // Toggle Play -> Pause
    await dockPlayBtn.click();
    await expect(dockPlayBtn).toHaveAttribute('aria-label', 'Pause');
  });

  test('TC-06: Progress Bar', async ({ page }) => {
     // Start playback
    await playFirstTrack(page);

    // Check if progress bar exists.
    // In PlayerDock.js, WaveformSeekbar is used.
    // We check for the canvas element inside .dock
    const waveform = page.locator('.dock .wave');
    await expect(waveform).toBeVisible();
    
    // Verify it exists in the DOM, implying it's rendered for the playing track
  });

  test('TC-07: Volume Control', async ({ page }) => {
    const volumeSlider = page.getByRole('slider', { name: 'Volume' });
    await expect(volumeSlider).toBeVisible();
    
    // Change volume
    await volumeSlider.fill('0.5');
    await expect(volumeSlider).toHaveValue('0.5');
    
    // Test Mute toggle
    const muteBtn = page.locator('.vol .iconBtn'); // Mute/Unmute button
    await muteBtn.click();
    
    // Slider value should be 0 when muted or visual indication
    // Code says: value={isMuted ? 0 : volume}
    await expect(volumeSlider).toHaveValue('0');
    
    // Unmute
    await muteBtn.click();
    await expect(volumeSlider).toHaveValue('0.5');
  });
});
