import { chromium } from '@playwright/test';
import path from 'path';

export default async function globalSetup() {
  // Use env vars in CI; fall back to the credentials captured during analysis for local runs.
  const username = process.env.TEST_USERNAME || "standard_user";
  const password = process.env.TEST_PASSWORD || "secret_sauce";
  const browser = await chromium.launch();
  const page    = await browser.newPage();
  await page.goto('https://www.saucedemo.com/', { waitUntil: 'domcontentloaded' });
  await page.locator('[type="text"],[type="email"],[name*="user"],[name*="email"]').first().fill(username);
  await page.locator('[type="password"]').first().fill(password);
  const beforeClickUrl = page.url();
  const loginForm = page.locator('form:has(input[type="password"])');
  const inForm    = await loginForm.count() > 0;
  await (inForm ? loginForm.locator('input[type="submit"],button[type="submit"],button:has-text("Login"),button:has-text("Sign in"),button:has-text("Log in")').first() : page.locator('input[type="submit"],button[type="submit"],button:has-text("Login"),button:has-text("Sign in"),button:has-text("Log in")').first()).click();
  await Promise.race([
    page.waitForURL(u => u !== beforeClickUrl, { timeout: 15000 }),
    page.waitForLoadState('networkidle', { timeout: 15000 }),
  ]).catch(() => {});
  // Use absolute path so both global-setup and test runner find the same file
  await page.context().storageState({ path: path.resolve(__dirname, '..', 'auth-state.json') });
  await browser.close();
}
