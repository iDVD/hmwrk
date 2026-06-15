import { test, expect } from '../../fixtures/base.fixture';
import { BASE_URL } from '../../pages/WallpaperPage';

// ---------------------------------------------------------------------------
// Test Suite 1 — Search functionality
// ---------------------------------------------------------------------------
test.describe('Wallpaper search', () => {

    test('Search wallpapers by single character', async ({ page }) => {
    const wallpaperPage = new WallpaperPage(page);
    await wallpaperPage.open();
    // Search for 'a'
    await wallpaperPage.search('a');
    // Ensure the url contains the search keyword
    await expect(wallpaperPage.getPage()).toHaveURL(/a/);
    // Verify that the search results doesn't contain wallpapers
    expect(await wallpaperPage.thumbnailCount()).toBe(0);
  });

  test('Search wallpapers by single keyword', async ({ page }) => {
    const wallpaperPage = new WallpaperPage(page);
    await wallpaperPage.open();
    await wallpaperPage.search('piston');
    await expect(wallpaperPage.getPage()).toHaveURL(/piston/);
    expect(await wallpaperPage.thumbnailCount()).toBeGreaterThan(0);
  });

  test('Search wallpapers by multiple keywords', async ({ page }) => {
    const wallpaperPage = new WallpaperPage(page);
    await wallpaperPage.open();
    await wallpaperPage.search('nutella in pancake');
    await expect(wallpaperPage.getPage()).toHaveURL(`${BASE_URL}/find/nutella%20in%20pancake`);
    expect(await wallpaperPage.thumbnailCount()).toBeGreaterThan(0);
  });

  test('Search wallpapers by special characters', async ({ page }) => {
    const wallpaperPage = new WallpaperPage(page);
    await wallpaperPage.open();
    // Search for '&^'
    await wallpaperPage.search('&^');
    await expect(wallpaperPage.getPage()).toHaveURL(`${BASE_URL}/find/%26%5E`);
    expect(await wallpaperPage.thumbnailCount()).toBe(0);
  });

  test('Search wallpapers by Category name', async ({ page }) => {
    const wallpaperPage = new WallpaperPage(page);
    await wallpaperPage.open();
    // Click on Category name
    await wallpaperPage.openCategoryMenu();
    await wallpaperPage.selectCategory('BRANDS');
    await expect(wallpaperPage.getPage()).toHaveURL(`${BASE_URL}/wallpapers?categories=BRANDS`);
    expect(await wallpaperPage.thumbnailCount()).toBeGreaterThan(0);
  });

});
