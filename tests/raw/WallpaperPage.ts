import { Page, Locator } from '@playwright/test';

// ---------------------------------------------------------------------------
// Config – swap for process.env.BASE_URL so the hostname never has to be
// changed in more than one place.
// ---------------------------------------------------------------------------
export const BASE_URL = process.env.BASE_URL ?? 'https://www.superweb.net';

// ---------------------------------------------------------------------------
// Selectors – all in one place, never leaked into test files
// ---------------------------------------------------------------------------
const SELECTORS = {
  searchInput:       'input[id="search"]',
  submitButton:      'button[type="submit"][title="Search"]:visible',
  hamburgerMenu:     'button[aria-haspopup="dialog"][data-state="closed"]',
  categoryButton: (name: string) => `a[href="/wallpapers?categories=${name}"]`,
  downloadButton:    'main button[type="button"]:has-text("Download"):visible',
  thumbnails:        '.aspect-wallpaper',
  premICon:          'span[style*="premium"]',
  premiumBadge:  '.Card_card-header__itIwa .Badge_badge__xuBFf',
  coinIndicator: '.Card_card-footer__I2PFs .Badge_badge__xuBFf',
  AcceptALLCook: '[id="didomi-notice-agree-button"]', 
} as const;

// ---------------------------------------------------------------------------
// Card — thin wrapper around a single wallpaper card locator
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
    return this.page.locator(SELECTORS.premICon);
  }
  
}

// ---------------------------------------------------------------------------
// WallpaperPage — page object; `page` (the driver) is private and never
// exposed to test files
// ---------------------------------------------------------------------------
export class WallpaperPage {
  constructor(private readonly page: Page) {}

  // Navigation
  async open(): Promise<void> {
    await this.page.goto(`${BASE_URL}/ringtones-and-wallpapers`);
    await this.page.click(SELECTORS.AcceptALLCook);
  }

// ---------------------------------------------------------------------------

  // Search actions
  async search(keyword: string): Promise<void> {
    await this.page.type(SELECTORS.searchInput, keyword);
    await this.page.waitForTimeout(2000);
    await this.page.click(SELECTORS.submitButton);
    await this.page.waitForTimeout(2000);
  }

  async openCategoryMenu(): Promise<void> {
    await this.page.click(SELECTORS.hamburgerMenu);
  }

  async selectCategory(name: string): Promise<void> {
    await this.page.waitForTimeout(2000);
    await this.page.click(SELECTORS.categoryButton(name));
  }

// ---------------------------------------------------------------------------

  // Download actions
  async clickDownload(): Promise<void> {
    await this.page.click(SELECTORS.downloadButton);
    await this.page.waitForTimeout(2000);    
  }

// ---------------------------------------------------------------------------

  // Getters / queries
  async thumbnailCount(): Promise<number> {
    return this.page.locator(SELECTORS.thumbnails).count();
  }

  card(index: number): WallpaperCard {
    return new WallpaperCard(this.page.locator(SELECTORS.thumbnails).nth(index));
  }

  firstCard(): WallpaperCard {
    return new WallpaperCard(this.page.locator(SELECTORS.thumbnails).first());
  }

  getPage(): Page {
    // Exposed only so test files can pass `page` to Playwright's `expect(page)`
    // assertions — not for direct driver calls.
    return this.page;
  }
}
