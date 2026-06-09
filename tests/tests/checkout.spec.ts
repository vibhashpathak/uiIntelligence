import { test, expect } from '@playwright/test';

test.describe('Checkout', () => {

  test('checkout page is reachable after adding item', async ({ page }) => {
    await page.goto("https://www.saucedemo.com/inventory.html");
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await page.locator('[data-test="shopping-cart-link"],a[href*="cart"],a[class*="cart"]').first().click();
    await page.locator('button:has-text("Checkout"),[data-test="checkout"]').first().click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).not.toHaveURL(/cart/);
  });

  test('all checkout form fields are visible', async ({ page }) => {
    await page.goto("https://www.saucedemo.com/inventory.html");
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await page.locator('[data-test="shopping-cart-link"],a[href*="cart"],a[class*="cart"]').first().click();
    await page.locator('button:has-text("Checkout"),[data-test="checkout"]').first().click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();
    await expect(page.locator('[data-test="lastName"]')).toBeVisible();
    await expect(page.locator('[data-test="postalCode"]')).toBeVisible();
  });

  test('all checkout fields are editable', async ({ page }) => {
    await page.goto("https://www.saucedemo.com/inventory.html");
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await page.locator('[data-test="shopping-cart-link"],a[href*="cart"],a[class*="cart"]').first().click();
    await page.locator('button:has-text("Checkout"),[data-test="checkout"]').first().click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('[data-test="firstName"]')).toBeEditable();
    await expect(page.locator('[data-test="lastName"]')).toBeEditable();
    await expect(page.locator('[data-test="postalCode"]')).toBeEditable();
  });

  test('submitting empty form shows error', async ({ page }) => {
    await page.goto("https://www.saucedemo.com/inventory.html");
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await page.locator('[data-test="shopping-cart-link"],a[href*="cart"],a[class*="cart"]').first().click();
    await page.locator('button:has-text("Checkout"),[data-test="checkout"]').first().click();
    await page.waitForLoadState('domcontentloaded');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"],[class*="error-message"],[role="alert"],[class*="error"]:not(input):not(select):not(textarea),[role="alert"],[class*="invalid"]:not(input):not(select):not(textarea)').first()).toBeVisible();
  });

  test('filling only first name and submitting shows error', async ({ page }) => {
    await page.goto("https://www.saucedemo.com/inventory.html");
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await page.locator('[data-test="shopping-cart-link"],a[href*="cart"],a[class*="cart"]').first().click();
    await page.locator('button:has-text("Checkout"),[data-test="checkout"]').first().click();
    await page.waitForLoadState('domcontentloaded');
    await page.locator('[data-test="firstName"]').fill('Test');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"],[class*="error-message"],[role="alert"],[class*="error"]:not(input):not(select):not(textarea),[role="alert"],[class*="invalid"]:not(input):not(select):not(textarea)').first()).toBeVisible();
  });

  test('continue button is visible and enabled', async ({ page }) => {
    await page.goto("https://www.saucedemo.com/inventory.html");
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await page.locator('[data-test="shopping-cart-link"],a[href*="cart"],a[class*="cart"]').first().click();
    await page.locator('button:has-text("Checkout"),[data-test="checkout"]').first().click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('[data-test="continue"]')).toBeVisible();
    await expect(page.locator('[data-test="continue"]')).toBeEnabled();
  });

  test('cancel button returns to cart', async ({ page }) => {
    await page.goto("https://www.saucedemo.com/inventory.html");
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await page.locator('[data-test="shopping-cart-link"],a[href*="cart"],a[class*="cart"]').first().click();
    await page.locator('button:has-text("Checkout"),[data-test="checkout"]').first().click();
    await page.waitForLoadState('domcontentloaded');
    await page.locator('button:has-text("Cancel"),[data-test="cancel"]').click();
    await expect(page).toHaveURL(/cart/);
  });

  test('filling all fields and continuing shows order overview', async ({ page }) => {
    await page.goto("https://www.saucedemo.com/inventory.html");
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await page.locator('[data-test="shopping-cart-link"],a[href*="cart"],a[class*="cart"]').first().click();
    await page.locator('button:has-text("Checkout"),[data-test="checkout"]').first().click();
    await page.waitForLoadState('domcontentloaded');
    await page.locator('[data-test="firstName"]').fill("Test");
    await page.locator('[data-test="lastName"]').fill("Doe");
    await page.locator('[data-test="postalCode"]').fill("12345");
    await page.locator('[data-test="continue"]').click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).not.toHaveURL(new RegExp("checkout-step-one\\.html"));
  });

  test('order overview shows item summary and total', async ({ page }) => {
    await page.goto("https://www.saucedemo.com/inventory.html");
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await page.locator('[data-test="shopping-cart-link"],a[href*="cart"],a[class*="cart"]').first().click();
    await page.locator('button:has-text("Checkout"),[data-test="checkout"]').first().click();
    await page.waitForLoadState('domcontentloaded');
    await page.locator('[data-test="firstName"]').fill("Test");
    await page.locator('[data-test="lastName"]').fill("Doe");
    await page.locator('[data-test="postalCode"]').fill("12345");
    await page.locator('[data-test="continue"]').click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('[class*="summary_subtotal"],[data-test*="subtotal-label"],[class*="subtotal"]').first()).toBeVisible();
  });

  test('completing purchase shows confirmation page', async ({ page }) => {
    await page.goto("https://www.saucedemo.com/inventory.html");
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await page.locator('[data-test="shopping-cart-link"],a[href*="cart"],a[class*="cart"]').first().click();
    await page.locator('button:has-text("Checkout"),[data-test="checkout"]').first().click();
    await page.waitForLoadState('domcontentloaded');
    await page.locator('[data-test="firstName"]').fill("Test");
    await page.locator('[data-test="lastName"]').fill("Doe");
    await page.locator('[data-test="postalCode"]').fill("12345");
    await page.locator('[data-test="continue"]').click();
    await page.waitForLoadState('domcontentloaded');
    await page.locator('button:has-text("Finish"),[data-test="finish"]').click();
    await expect(page.locator('[class*="complete"],[data-test*="complete"],[class*="checkout_complete"]').first()).toBeVisible();
  });
});

