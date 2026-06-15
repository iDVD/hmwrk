import { test, expect } from '../../fixtures/base.fixture';

// Test Case 2.1: Verifying if wallpapers have only coin icon
test('Test if coin icon appears on wallpapers thumbnail', async ({ page }) => {
  

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
 
  await wallpaperPage.search('sunset');
  expect(await wallpaperPage.thumbnailCount()).toBeGreaterThan(0);
  
  const firstCard = wallpaperPage.firstCard();
  await firstCard.click()

  await page.waitForLoadState('networkidle');

  await expect(wallpaperPage.premiumIcon()).toBeVisible();
});
