import { test, expect } from '@playwright/test';

test.describe('End-to-End Purchase Flow', () => {

  test('full purchase: login -> add item -> checkout -> order complete', async ({ page }) => {
    await page.goto("https://www.saucedemo.com/inventory.html");
    const addBtn = page.locator('button:has-text("Add to cart"),[data-test*="add-to-cart"]').first();
    await addBtn.click();
    await page.locator('[data-test="shopping-cart-link"],a[href*="cart"],[class*="shopping_cart_link"]').first().click();
    await page.locator('button:has-text("Checkout"),[data-test="checkout"]').first().click();
    await page.waitForLoadState('domcontentloaded');
    await page.locator('[data-test="firstName"]').fill("Test");
    await page.locator('[data-test="lastName"]').fill("Doe");
    await page.locator('[data-test="postalCode"]').fill("12345");
    await page.locator('[data-test="continue"]').click();
    await page.waitForLoadState('domcontentloaded');
    await page.locator('button:has-text("Finish"),[data-test="finish"]').click();
    await expect(page.locator('[class*="complete"],[data-test*="complete-header"],[class*="checkout_complete"]').first()).toBeVisible();
  });
});

