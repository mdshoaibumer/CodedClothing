// @ts-check
import { test, expect } from '@playwright/test';

test.describe('CodedClothing - Full UI/UX & Functionality Test', () => {

  test('Homepage - Collection Page Screenshot & Analysis', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for images to load
    await page.waitForTimeout(2000);
    
    // Full page screenshot
    await page.screenshot({ path: 'tests/screenshots/01-homepage-full.png', fullPage: true });
    
    // Check header exists
    const header = page.locator('header');
    await expect(header).toBeVisible();
    await header.screenshot({ path: 'tests/screenshots/02-header.png' });
    
    // Check brand name
    const brandName = page.locator('text=Coded Clothing');
    await expect(brandName).toBeVisible();
    
    // Check page title
    const title = page.locator('h1');
    await expect(title).toContainText('Choose Your T-Shirt');
    
    // Check product cards exist
    const cards = page.locator('a[href^="/product/"]');
    const count = await cards.count();
    console.log(`Found ${count} product cards`);
    expect(count).toBeGreaterThan(0);
    
    // Screenshot first product card
    const firstCard = cards.first();
    await firstCard.screenshot({ path: 'tests/screenshots/03-product-card.png' });
    
    // Check badge labels exist (Bestseller, Popular, New)
    const badges = page.locator('span:has-text("Bestseller"), span:has-text("Popular"), span:has-text("New")');
    const badgeCount = await badges.count();
    console.log(`Found ${badgeCount} badge labels`);
  });

  test('Product Detail Page - Navigation & Layout', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Click first product
    const firstCard = page.locator('a[href^="/product/"]').first();
    await firstCard.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    
    // Full page screenshot
    await page.screenshot({ path: 'tests/screenshots/04-product-detail-full.png', fullPage: true });
    
    // Check product image is visible
    const productImage = page.locator('img').first();
    await expect(productImage).toBeVisible();
    
    // Check size selector exists
    const sizeButtons = page.locator('button:has-text("S"), button:has-text("M"), button:has-text("L"), button:has-text("XL")');
    const sizeCount = await sizeButtons.count();
    console.log(`Found ${sizeCount} size buttons`);
    
    // Screenshot size selector area
    if (sizeCount > 0) {
      await sizeButtons.first().screenshot({ path: 'tests/screenshots/05-size-button.png' });
    }
    
    // Check Customize button
    const customizeBtn = page.locator('button:has-text("Customize"), a:has-text("Customize")');
    if (await customizeBtn.count() > 0) {
      await customizeBtn.first().screenshot({ path: 'tests/screenshots/06-customize-button.png' });
    }
    
    // Test view toggle (front/back)
    const viewButtons = page.locator('button:has-text("front"), button:has-text("back"), button:has-text("Front"), button:has-text("Back")');
    const viewCount = await viewButtons.count();
    console.log(`Found ${viewCount} view toggle buttons`);
    
    if (viewCount > 0) {
      await viewButtons.last().click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'tests/screenshots/07-product-back-view.png', fullPage: true });
    }
  });

  test('Product Detail - Size Guide Modal', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Navigate to first product
    await page.locator('a[href^="/product/"]').first().click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Try to open size guide
    const sizeGuideBtn = page.locator('button:has-text("Size Guide"), button:has-text("size guide"), a:has-text("Size Guide")');
    if (await sizeGuideBtn.count() > 0) {
      await sizeGuideBtn.first().click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'tests/screenshots/08-size-guide-modal.png', fullPage: true });
      
      // Close modal
      const closeBtn = page.locator('[aria-label="Close"], button:has-text("×"), button:has-text("Close")');
      if (await closeBtn.count() > 0) {
        await closeBtn.first().click();
      }
    }
  });

  test('Customize Page - Full Flow', async ({ page }) => {
    // Navigate directly to customize page for first product
    await page.goto(`/customize/ts-black-01`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Full page screenshot
    await page.screenshot({ path: 'tests/screenshots/09-customize-page-full.png', fullPage: true });
    
    // Check T-shirt canvas is visible
    const canvas = page.locator('[class*="canvas"], [class*="preview"], img[alt*="shirt"], img[alt*="Shirt"]');
    if (await canvas.count() > 0) {
      await canvas.first().screenshot({ path: 'tests/screenshots/10-tshirt-canvas.png' });
    }
    
    // Check upload logo section
    const uploadSection = page.locator('text=Upload, text=upload, input[type="file"]');
    if (await uploadSection.count() > 0) {
      console.log('Upload section found');
    }
    
    // Check view toggles (front/back)
    const frontBtn = page.getByRole('button', { name: 'front', exact: true });
    const backBtn = page.getByRole('button', { name: 'back', exact: true });
    
    if (await frontBtn.count() > 0 && await backBtn.count() > 0) {
      // Switch to back view
      await backBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'tests/screenshots/11-customize-back-view.png', fullPage: true });
      
      // Switch back to front
      await frontBtn.click();
      await page.waitForTimeout(500);
    }
  });

  test('Responsive Design - Mobile View', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Mobile homepage screenshot
    await page.screenshot({ path: 'tests/screenshots/12-mobile-homepage.png', fullPage: true });
    
    // Navigate to product detail
    await page.locator('a[href^="/product/"]').first().click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'tests/screenshots/13-mobile-product-detail.png', fullPage: true });
    
    // Navigate to customize
    await page.goto(`/customize/ts-black-01`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'tests/screenshots/14-mobile-customize.png', fullPage: true });
  });

  test('Responsive Design - Tablet View', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await page.screenshot({ path: 'tests/screenshots/15-tablet-homepage.png', fullPage: true });
    
    await page.goto(`/customize/ts-black-01`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'tests/screenshots/16-tablet-customize.png', fullPage: true });
  });

  test('404 Page', async ({ page }) => {
    await page.goto(`/nonexistent-page`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await page.screenshot({ path: 'tests/screenshots/17-404-page.png', fullPage: true });
    
    // Check 404 content
    const heading = page.locator('text=404');
    await expect(heading).toBeVisible();
    
    const returnLink = page.locator('text=Return to Collection');
    await expect(returnLink).toBeVisible();
  });

  test('Navigation & Routing', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Click brand name to go home
    const brandLink = page.locator('a:has-text("Coded Clothing")');
    await expect(brandLink).toBeVisible();
    
    // Navigate to product and back
    await page.locator('a[href^="/product/"]').first().click();
    await page.waitForLoadState('networkidle');
    
    // Check URL changed
    expect(page.url()).toContain('/product/');
    
    // Go back to home via brand link
    await brandLink.click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toBe(`/`);
  });

  test('Hover Effects & Interactions', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    
    // Hover over first card
    const firstCard = page.locator('a[href^="/product/"]').first();
    await firstCard.hover();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tests/screenshots/18-card-hover.png', fullPage: true });
  });

  test('Performance & Loading States', async ({ page }) => {
    // Throttle network to see loading states
    await page.goto('/');
    
    // Screenshot immediately to catch loading spinner
    await page.screenshot({ path: 'tests/screenshots/19-loading-state.png' });
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'tests/screenshots/20-loaded-state.png' });
  });

  test('Accessibility - Focus States & Tab Navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Tab through elements
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    await page.screenshot({ path: 'tests/screenshots/21-focus-states.png', fullPage: true });
  });
});
