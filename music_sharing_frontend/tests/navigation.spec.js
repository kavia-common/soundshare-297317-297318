const { test, expect } = require('@playwright/test');

test.describe('User Interface & Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC-01: Homepage Load', async ({ page }) => {
    // Verify that the homepage loads successfully
    // Assuming "SoundShare" is visible in sidebar which indicates app load
    await expect(page.getByText('SoundShare')).toBeVisible();
    
    // Check for Home heading or indicator
    // Home page usually has "Your Mix" or similar, checking page structure
    // Based on App.js, Home component renders.
    // We can check if the sidebar link for Home is active by default or just present.
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
  });

  test('TC-02: Navigation Bar Links', async ({ page }) => {
    // Check for sidebar links
    const sidebar = page.locator('.sidebarInner'); // Using class as per component source, or by role if accessible
    await expect(sidebar).toBeVisible();
    
    // Links present
    await expect(sidebar.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'Explore' })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'Library' })).toBeVisible();
    
    // Confirm Upload and Profile are NOT present as per plan/implementation
    await expect(sidebar.getByRole('link', { name: 'Upload' })).not.toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'Profile' })).not.toBeVisible();
  });

  test('TC-03: Search Bar', async ({ page }) => {
    const searchInput = page.getByRole('textbox', { name: 'Search' });
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeEditable();
    
    // Verify placeholder text
    await expect(searchInput).toHaveAttribute('placeholder', 'Search tracks, artists...');
  });

  test('TC-16: Responsiveness', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verify layout adapts.
    // Check if search bar is still accessible/visible
    const searchInput = page.getByRole('textbox', { name: 'Search' });
    await expect(searchInput).toBeVisible();
    
    // Ensure critical navigation is still present or accessible
    // Depending on CSS, sidebar might be hidden or icon-only. 
    // We verify at least the brand or main content is visible.
    await expect(page.getByText('SoundShare')).toBeVisible();
  });
});
