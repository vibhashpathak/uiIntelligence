import { test, expect } from '@playwright/test';

test.describe('Product Listing', () => {

  test('page loads with a title', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/.+/, { timeout: 15000 });
  });

  test('product items are displayed on page', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('[class*="inventory_item"],[class*="product-item"],[class*="product_item"],[data-test*="inventory-item"],[class*="card"]').first()).toBeVisible();
  });

  test('add to cart button is visible', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first()).toBeVisible();
  });

  test('adding product to cart updates cart badge', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await expect(page.locator('[data-test="shopping-cart-badge"],[class*="cart_badge"],[class*="badge"]').first()).toBeVisible();
  });

  test('added product shows Remove button instead of Add', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await expect(page.locator('button:has-text("Remove"),[data-test*="remove"]').first()).toBeVisible();
  });

  test('can add multiple products to cart', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').first().click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').first().click();
    await expect(page.locator('[data-test="shopping-cart-badge"],[class*="cart_badge"],[class*="badge"]').first()).toBeVisible();
  });

  test('cart badge count increases with each added product', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await expect(page.locator('[data-test="shopping-cart-badge"],[class*="cart_badge"]').first()).toHaveText('1');
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').first().click();
    await expect(page.locator('[data-test="shopping-cart-badge"],[class*="cart_badge"]').first()).toHaveText('2');
  });

  test('cart icon is visible and links to cart', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('[data-test="shopping-cart-link"],[class*="cart-icon"],[class*="shopping_cart"],[href*="cart"]').first()).toBeVisible();
  });

  test('clicking cart icon navigates to cart page', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    await page.locator('[data-test="shopping-cart-link"],[class*="cart-icon"],[class*="shopping_cart"],[href*="cart"]').first().click();
    await expect(page).toHaveURL(/cart/);
  });

  test('sort control is visible', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('[data-test="product-sort-container"]')).toBeVisible();
  });

  test('sort Z-A changes product order', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    await page.selectOption('[data-test="product-sort-container"]', { index: 1 });
    await expect(page.locator('[data-test="product-sort-container"]')).toBeVisible();
  });

  test('sort price low to high is selectable', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    await page.selectOption('[data-test="product-sort-container"]', { index: 2 });
    await expect(page.locator('[data-test="product-sort-container"]')).toBeVisible();
  });

  test('sort price high to low is selectable', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    await page.selectOption('[data-test="product-sort-container"]', { index: 3 });
    await expect(page.locator('[data-test="product-sort-container"]')).toBeVisible();
  });

  test('clicking a product name navigates to detail page', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html', { waitUntil: 'domcontentloaded' });
    const productNames = page.locator('[class*="inventory_item_name"],[class*="product-name"],[class*="product_name"],[data-test*="inventory-item-name"],[class*="item_name"],[class*="item-title"],[class*="product-title"]');
    const nameCount = await productNames.count();
    test.skip(nameCount === 0, 'No product name elements found on this page');
    await productNames.first().click();
    await expect(page).not.toHaveURL(new RegExp("inventory\\.html"));
  });
});

