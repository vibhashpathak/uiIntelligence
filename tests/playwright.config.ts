import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir:     './tests',
  timeout:     60_000,
  retries:     0,
  workers:     2,
  expect:      { timeout: 15_000 },
  globalSetup: require.resolve('./support/global-setup'),
  use: {
    baseURL:   'https://www.saucedemo.com/',
    headless:  true,
    viewport:  { width: 1280, height: 720 },
    screenshot:'only-on-failure',
    video:     'retain-on-failure',
    browserName: 'chromium',
      storageState: require('path').resolve(__dirname, 'auth-state.json'),
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' },
    launchOptions: {
      args: ['--disable-blink-features=AutomationControlled', '--no-sandbox', '--disable-setuid-sandbox'],
    },
  },
  reporter: [['html', { open: 'never' }], ['json', { outputFile: 'results.json' }]],
});
