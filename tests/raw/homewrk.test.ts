import { test, expect } from '@playwright/test';
import { WallpaperPage, BASE_URL } from './WallpaperPage';

test.describe('Wallpaper search functionality', () => {

  // ---------------------------------------------------------------------------
  // Test Cases 1: Searching for wallpaper
  // ---------------------------------------------------------------------------

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


  //-----------------------------------////-----------------------------------//


  // Test Case 2.1: Verifying if wallpapers have only coin icon
  test('Test if coin icon appears on wallpapers thumbnail', async ({ page }) => {
    const wallpaperPage = new WallpaperPage(page);
    await wallpaperPage.open();
    await wallpaperPage.search('city');

    const count = await wallpaperPage.thumbnailCount();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const card = wallpaperPage.card(i);
      // Verify coin indicator exists and no premium badge
      await expect(card.premiumBadge).toHaveCount(0);                  
      expect(await card.coinIndicator.count()).toBeGreaterThan(0);        
    }
  });

  //Test Case 2.2: Verify if wallpaper is premium in single page view
  test('Test if premium badge and coin icon appears on premium wallpapers thumbnail', async ({ page }) => {
    const wallpaperPage = new WallpaperPage(page);
    await wallpaperPage.open();
    await wallpaperPage.search('sunset');
    expect(await wallpaperPage.thumbnailCount()).toBeGreaterThan(0);
    
    const firstCard = wallpaperPage.firstCard();
    await firstCard.click()

    await page.waitForLoadState('networkidle');

    await expect(wallpaperPage.premiumIcon()).toBeVisible();
  });


  //-----------------------------------////-----------------------------------//


  // Test Case 3: Downloading and verify free wallpaper 
  test('Test for wallpaper download without Premium badge', async ({ page }) => {  
  const wallpaperPage = new WallpaperPage(page);
  await wallpaperPage.open();
  await wallpaperPage.search('green');
  await expect(wallpaperPage.getPage()).toHaveURL(`${BASE_URL}/find/green`);
  
  const firstCard = wallpaperPage.firstCard();
  await firstCard.click();
  
  if (!(await firstCard.isPremium())) {

    const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
    await wallpaperPage.clickDownload();
    
    // Wait for download to trigger and save it
    const download = await downloadPromise;
    await download.saveAs('./Downloads/wallpaper.jpg');
    
    // Verify download was successful
    const fs = require('fs');
    expect(fs.existsSync('./Downloads/wallpaper.jpg')).toBe(true);
    expect(download.suggestedFilename()).toContain('.jpg');
    console.log('Successfully downloaded:', download.suggestedFilename());
  } else {
    console.log('Wallpaper is Premium');
    }
  });

  //-----------------------------------////-----------------------------------//

});
