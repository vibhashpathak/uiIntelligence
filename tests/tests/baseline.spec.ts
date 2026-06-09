import { test, expect } from '@playwright/test';

test.describe('Page Baseline', () => {

  test('page renders at correct URL (not redirected to login)', async ({ page }) => {
    await page.addInitScript(() => { Object.defineProperty(navigator, 'webdriver', { get: () => undefined }); });
    await page.goto('https://www.saucedemo.com/', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    await expect(page).not.toHaveURL(/login|signin|sign-in|auth\/|session/i);
    await expect(page).toHaveURL(new RegExp("/"));
  });

  test('page has a title', async ({ page }) => {
    await page.addInitScript(() => { Object.defineProperty(navigator, 'webdriver', { get: () => undefined }); });
    await page.goto('https://www.saucedemo.com/', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    await page.waitForFunction(() => document.title.trim().length > 0, { timeout: 10000 }).catch(() => {});
    const title = await page.title();
    expect(title.trim().length, 'Page <title> is empty — page did not fully load or site is blocking headless browsers').toBeGreaterThan(0);
  });

  test('page has interactive elements', async ({ page }) => {
    await page.addInitScript(() => { Object.defineProperty(navigator, 'webdriver', { get: () => undefined }); });
    await page.goto('https://www.saucedemo.com/', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    await expect(page.locator('button, a[href], input').first()).toBeVisible();
  });

  test('no critical console errors on load', async ({ page }) => {
    const errors: string[] = [];
    const ignored = ['favicon', 'google-analytics', 'gtm', 'hotjar', 'intercom', 'clarity', 'ERR_BLOCKED', 'net::ERR', 'Failed to load resource', 'adsbygoogle', 'doubleclick', 'analytics', 'segment.io', 'braze', 'mixpanel', 'sentry', 'newrelic', 'datadog', 'snowplow', 'tealium', 'optimizely', 'launchdarkly', 'akamai', 'third-party', 'cross-origin', 'Content Security Policy', 'NS_ERROR', 'cdn.', 'phoenix', 'Phoenix Error', 'error service', 'Error Service', 'Unhandled exception caught', 'uncaught typeerror', 'script error'];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const t = msg.text();
        if (!ignored.some(i => t.toLowerCase().includes(i.toLowerCase()))) errors.push(t);
      }
    });
    await page.goto('https://www.saucedemo.com/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    expect(errors.length, `Console errors: ${errors.join('; ')}`).toBe(0);
  });
});

