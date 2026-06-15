import { test, expect } from '../../fixtures/base.fixture';
import { BASE_URL } from '../../pages/WallpaperPage';
import * as fs from 'fs';

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