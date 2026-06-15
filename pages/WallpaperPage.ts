import { Page, Locator } from '@playwright/test';
import { SELECTORS } from './selectors';
import { WallpaperCard } from './WallpaperCard';

export const BASE_URL = process.env.BASE_URL ?? 'https://superweb.net';

// ---------------------------------------------------------------------------
// WallpaperPage — page object. `page` (the Playwright driver) is private and
// never exposed to test files directly; tests go through named methods only.
// ---------------------------------------------------------------------------
export class WallpaperPage {
  constructor(private readonly page: Page) {}

  // Navigation
  async open(): Promise<void> {
    await this.page.goto(`${BASE_URL}/ringtones-and-wallpapers`);
    await this.page.click(SELECTORS.AcceptALLCook);
  }

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


  // Download actions
  async clickDownload(): Promise<void> {
    await this.page.click(SELECTORS.downloadButton);
    await this.page.waitForTimeout(2000);    
  }


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
