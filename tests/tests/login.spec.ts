import { test, expect } from '@playwright/test';

// Login tests must start without an existing session
test.use({ storageState: undefined });

test.describe('Login', () => {

  test('successful login redirects away from login page', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[type="text"],[type="email"],[name*="user"],[name*="email"]').fill(process.env.TEST_USERNAME || 'standard_user');
    await page.locator('[type="password"]').fill(process.env.TEST_PASSWORD || 'secret_sauce');
    await page.locator('input[type="submit"],button[type="submit"],button:has-text("Login"),button:has-text("Sign in"),button:has-text("Log in")').click();
    await expect(page).not.toHaveURL(new RegExp("^https://www\\.saucedemo\\.com\\/?$"));
  });

  test('invalid credentials show error message', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[type="text"],[type="email"],[name*="user"],[name*="email"]').fill('invalid_user_xyz');
    await page.locator('[type="password"]').fill('wrong_password_xyz');
    await page.locator('input[type="submit"],button[type="submit"],button:has-text("Login"),button:has-text("Sign in"),button:has-text("Log in")').click();
    await expect(page.locator('[data-test="error"],[class*="error-message"],[role="alert"]').filter({ hasText: /.+/ }).first()).toBeVisible();
  });

  test('empty username shows error message', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[type="password"]').fill('somepassword');
    await page.locator('input[type="submit"],button[type="submit"],button:has-text("Login"),button:has-text("Sign in"),button:has-text("Log in")').click();
    await expect(page.locator('[data-test="error"],[class*="error-message"],[role="alert"]').filter({ hasText: /.+/ }).first()).toBeVisible();
  });

  test('empty password shows error message', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[type="text"],[type="email"],[name*="user"],[name*="email"]').fill('standard_user');
    await page.locator('input[type="submit"],button[type="submit"],button:has-text("Login"),button:has-text("Sign in"),button:has-text("Log in")').click();
    await expect(page.locator('[data-test="error"],[class*="error-message"],[role="alert"]').filter({ hasText: /.+/ }).first()).toBeVisible();
  });

  test('both fields empty shows error message', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('input[type="submit"],button[type="submit"],button:has-text("Login"),button:has-text("Sign in"),button:has-text("Log in")').click();
    await expect(page.locator('[data-test="error"],[class*="error-message"],[role="alert"]').filter({ hasText: /.+/ }).first()).toBeVisible();
  });

  test('username field accepts and retains text input', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[type="text"],[type="email"],[name*="user"],[name*="email"]').fill('testuser');
    await expect(page.locator('[type="text"],[type="email"],[name*="user"],[name*="email"]')).toHaveValue('testuser');
  });

  test('password field type is password (masked)', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await expect(page.locator('[type="password"]')).toHaveAttribute('type', 'password');
  });

  test('login page has a visible title or heading', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await expect(page).toHaveTitle(/.+/, { timeout: 15000 });
  });

  test('login button is visible and enabled', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await expect(page.locator('input[type="submit"],button[type="submit"],button:has-text("Login"),button:has-text("Sign in"),button:has-text("Log in")')).toBeVisible();
    await expect(page.locator('input[type="submit"],button[type="submit"],button:has-text("Login"),button:has-text("Sign in"),button:has-text("Log in")')).toBeEnabled();
  });

  test('username and password fields are visible', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await expect(page.locator('[type="text"],[type="email"],[name*="user"],[name*="email"]')).toBeVisible();
    await expect(page.locator('[type="password"]')).toBeVisible();
  });

  test('login form is keyboard accessible (Tab navigation)', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[type="text"],[type="email"],[name*="user"],[name*="email"]').focus();
    await expect(page.locator('[type="text"],[type="email"],[name*="user"],[name*="email"]')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.locator('[type="password"]')).toBeFocused();
  });

  test('can submit login form with Enter key', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[type="text"],[type="email"],[name*="user"],[name*="email"]').fill(process.env.TEST_USERNAME || 'standard_user');
    await page.locator('[type="password"]').fill(process.env.TEST_PASSWORD || 'secret_sauce');
    await page.locator('[type="password"]').press('Enter');
    await expect(page).not.toHaveURL(new RegExp("^https://www\\.saucedemo\\.com\\/?$"));
  });
});

