// ---------------------------------------------------------------------------
// Selectors — single source of truth for all locators.
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
