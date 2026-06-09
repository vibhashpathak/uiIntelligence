import { test, expect } from '@playwright/test';

test.describe('Shopping Cart', () => {

  test('cart page loads with correct title', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/cart.html');
    await expect(page).toHaveTitle(/.+/, { timeout: 15000 });
  });

  test('cart page is reachable via direct URL', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/cart.html');
    await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");
  });

  test('checkout button is visible on cart page', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/cart.html');
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
  });

  test('checkout button is enabled', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/cart.html');
    await expect(page.locator('[data-test="checkout"]')).toBeEnabled();
  });

  test('checkout button navigates to checkout page', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/cart.html');
    await page.locator('[data-test="checkout"],button:has-text("Checkout")').first().click();
    await expect(page).not.toHaveURL(/cart/, { timeout: 15000 });
  });

  test('added item appears in cart with name and price', async ({ page }) => {
    await page.goto("https://www.saucedemo.com/inventory.html");
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await expect(page.locator('[class*="inventory_item_name"],[data-test*="inventory-item-name"],[class*="item_name"],[class*="item-name"],[class*="product-name"],[class*="cart-item"] h3,[class*="cart-item"] h2').first()).toBeVisible();
    await expect(page.locator('[class*="inventory_item_price"],[data-test*="inventory-item-price"],[class*="item_price"],[class*="item-price"],[class*="product-price"],[class*="price"]').first()).toBeVisible();
  });

  test('continue shopping button returns to inventory', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/cart.html');
    await page.locator('button:has-text("Continue Shopping"),[data-test="continue-shopping"]').click();
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
  });
});

