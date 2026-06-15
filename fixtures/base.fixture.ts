import { test as base } from '@playwright/test';
import { WallpaperPage } from '../pages/WallpaperPage';

// ---------------------------------------------------------------------------
// Custom fixtures — extend Playwright's built-in `test` with a pre-opened
// WallpaperPage so individual tests don't repeat navigation boilerplate.
// ---------------------------------------------------------------------------
type WallpaperFixtures = {
  wallpaperPage: WallpaperPage;
};

export const test = base.extend<WallpaperFixtures>({
  wallpaperPage: async ({ page }, use) => {
    const wallpaperPage = new WallpaperPage(page);
    await wallpaperPage.open();
    await use(wallpaperPage);
  },
});

export { expect } from '@playwright/test';
