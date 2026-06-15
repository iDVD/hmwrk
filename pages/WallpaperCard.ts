import { Locator } from '@playwright/test';
import { SELECTORS } from './selectors';

// ---------------------------------------------------------------------------
// WallpaperCard — thin wrapper around a single wallpaper card locator.
// Kept in its own file so it can be imported independently if needed.
// ---------------------------------------------------------------------------
export class WallpaperCard {
  constructor(private readonly locator: Locator) {}

  get premiumBadge(): Locator {
    return this.locator.locator(SELECTORS.premiumBadge);
  }

  get coinIndicator(): Locator {
    return this.locator.locator(SELECTORS.coinIndicator);
  }

  async click(): Promise<void> {
    await this.locator.click();
  }

  async isPremium(): Promise<boolean> {
    return (await this.premiumBadge.count()) > 0;
  }

  premiumIcon(): Locator {
    return this.locator.locator(SELECTORS.premICon);
  }
  
}
