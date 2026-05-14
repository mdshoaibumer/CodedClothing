import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Placement Zone Visual Test
 * Uploads a logo and tests placement across different zones,
 * capturing screenshots for visual verification.
 */
test.describe('Placement Zone Visual Test', () => {
  test.use({ baseURL: 'http://localhost:5173' });
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/customize/ts-black-01?size=M');
    await page.waitForLoadState('networkidle');
    
    // Dismiss cookie consent if present
    const cookieBtn = page.locator('button:has-text("Accept"), button:has-text("Got it"), button:has-text("Agree")').first();
    if (await cookieBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await cookieBtn.click();
      await page.waitForTimeout(500);
    }
    
    // Wait for canvas
    await page.waitForSelector('[role="application"]', { timeout: 10000 });
  });

  test('Logo placement in different zones with screenshots', async ({ page }) => {
    // Create test logo image in-browser and upload
    const testImageDataUrl = await page.evaluate(() => {
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ff6600';
      ctx.fillRect(0, 0, 200, 200);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 40px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('LOGO', 100, 100);
      return canvas.toDataURL('image/png');
    });

    // Write temp logo file
    const base64Data = testImageDataUrl.replace(/^data:image\/png;base64,/, '');
    const tempLogoPath = path.join(__dirname, 'screenshots', 'temp-test-logo.png');
    fs.mkdirSync(path.dirname(tempLogoPath), { recursive: true });
    fs.writeFileSync(tempLogoPath, Buffer.from(base64Data, 'base64'));

    // Upload logo via file input
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(tempLogoPath);
    await page.waitForTimeout(2000);

    // Take screenshot - default placement
    await page.screenshot({
      path: 'tests/screenshots/02-logo-default-placement.png',
      fullPage: false
    });

    // Use the zone button list (not the silhouette overlay) - find by aria-label
    const zones = [
      { name: 'Left Chest', file: '03-left-chest-zone.png' },
      { name: 'Right Chest', file: '04-right-chest-zone.png' },
      { name: 'Center Chest', file: '05-center-chest-zone.png' },
      { name: 'Full Front', file: '06-full-front-zone.png' },
      { name: 'Lower Front', file: '07-lower-front-zone.png' },
    ];

    for (const zone of zones) {
      // Click zone button in the sidebar button list (not the silhouette overlay)
      const zoneBtn = page.locator(`[aria-label="${zone.name} placement zone"]`).last();
      if (await zoneBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await zoneBtn.click({ force: true });
        await page.waitForTimeout(1000);
        
        // Screenshot the canvas area
        const canvas = page.locator('[role="application"]').first();
        await canvas.screenshot({
          path: `tests/screenshots/${zone.file}`,
        });
        console.log(`✓ ${zone.name} zone screenshot captured`);
      } else {
        // Try finding by text content
        const textBtn = page.locator(`button:has-text("${zone.name}")`).last();
        if (await textBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await textBtn.click({ force: true });
          await page.waitForTimeout(1000);
          
          const canvas = page.locator('[role="application"]').first();
          await canvas.screenshot({
            path: `tests/screenshots/${zone.file}`,
          });
          console.log(`✓ ${zone.name} zone screenshot captured (via text)`);
        } else {
          console.log(`⚠ ${zone.name} button not found`);
        }
      }
    }

    // Full page screenshot for overall view
    await page.screenshot({
      path: 'tests/screenshots/08-full-page-overview.png',
      fullPage: true
    });

    // Clean up temp file
    if (fs.existsSync(tempLogoPath)) {
      fs.unlinkSync(tempLogoPath);
    }

    // Verify logo is rendered
    const logoImg = page.locator('img[alt="Custom Design"]').first();
    await expect(logoImg).toBeVisible();
  });
});
