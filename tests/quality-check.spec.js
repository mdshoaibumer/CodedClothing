import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5174';

test.describe('Console Errors & Warnings Check', () => {
  test('Homepage - Check for console errors', async ({ page }) => {
    const errors = [];
    const warnings = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
      if (msg.type() === 'warning') warnings.push(msg.text());
    });

    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('=== CONSOLE ERRORS ===');
    errors.forEach(e => console.log('  ERROR:', e));
    console.log(`Total errors: ${errors.length}`);
    
    console.log('=== CONSOLE WARNINGS ===');
    warnings.forEach(w => console.log('  WARN:', w));
    console.log(`Total warnings: ${warnings.length}`);
  });

  test('Product Detail - Check for console errors', async ({ page }) => {
    const errors = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto(`${BASE_URL}/product/ts-black-01`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('=== PRODUCT DETAIL ERRORS ===');
    errors.forEach(e => console.log('  ERROR:', e));
    console.log(`Total errors: ${errors.length}`);
  });

  test('Customize Page - Check for console errors', async ({ page }) => {
    const errors = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto(`${BASE_URL}/customize/ts-black-01`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('=== CUSTOMIZE PAGE ERRORS ===');
    errors.forEach(e => console.log('  ERROR:', e));
    console.log(`Total errors: ${errors.length}`);
  });

  test('Check broken images', async ({ page }) => {
    const brokenImages = [];
    
    page.on('response', response => {
      if (response.request().resourceType() === 'image' && response.status() >= 400) {
        brokenImages.push({ url: response.url(), status: response.status() });
      }
    });

    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    console.log('=== BROKEN IMAGES ===');
    brokenImages.forEach(img => console.log(`  BROKEN: ${img.url} (${img.status})`));
    console.log(`Total broken images: ${brokenImages.length}`);
  });

  test('Check page load performance', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    const domReady = Date.now() - startTime;
    
    await page.waitForLoadState('networkidle');
    const fullyLoaded = Date.now() - startTime;

    console.log('=== PERFORMANCE ===');
    console.log(`  DOM Ready: ${domReady}ms`);
    console.log(`  Fully Loaded: ${fullyLoaded}ms`);
    
    // Check if page loads reasonably fast
    expect(domReady).toBeLessThan(5000);
    expect(fullyLoaded).toBeLessThan(10000);
  });
});
