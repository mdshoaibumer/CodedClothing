import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Verifies that the logo is correctly positioned within each zone's bounding box.
 * Checks that the logo doesn't overflow outside the T-shirt area.
 */
test.describe('Logo Zone Position Verification', () => {
  test.use({ baseURL: 'http://localhost:5173' });
  test.setTimeout(60000);

  test('Logo stays within zone bounds for all zones', async ({ page }) => {
    await page.goto('/customize/ts-black-01?size=M');
    await page.waitForLoadState('networkidle');

    // Dismiss cookie consent
    const cookieBtn = page.locator('button:has-text("Accept"), button:has-text("Got it")').first();
    if (await cookieBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await cookieBtn.click();
      await page.waitForTimeout(500);
    }

    await page.waitForSelector('[role="application"]', { timeout: 10000 });

    // Create and upload test logo
    const testImageDataUrl = await page.evaluate(() => {
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ff6600';
      ctx.fillRect(0, 0, 200, 200);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 40px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('LOGO', 100, 100);
      return canvas.toDataURL('image/png');
    });

    const base64Data = testImageDataUrl.replace(/^data:image\/png;base64,/, '');
    const tempLogoPath = path.join(__dirname, 'screenshots', 'temp-verify-logo.png');
    fs.mkdirSync(path.dirname(tempLogoPath), { recursive: true });
    fs.writeFileSync(tempLogoPath, Buffer.from(base64Data, 'base64'));

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(tempLogoPath);
    await page.waitForTimeout(2000);

    // Get the canvas element bounds
    const canvasEl = page.locator('[role="application"]').first();
    const canvasBounds = await canvasEl.boundingBox();
    console.log('Canvas bounds:', canvasBounds);

    const zones = ['Left Chest', 'Right Chest', 'Center Chest', 'Full Front', 'Lower Front'];
    const results = [];

    for (const zoneName of zones) {
      const zoneBtn = page.locator(`[aria-label="${zoneName} placement zone"]`).last();
      if (await zoneBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await zoneBtn.click({ force: true });
        await page.waitForTimeout(800);

        // Get the logo image position
        const logoImg = page.locator('img[alt="Custom Design"]').first();
        const logoBounds = await logoImg.boundingBox();

        // Get the zone dashed border position (the gold/dashed border overlay)
        const zoneBorder = page.locator('[role="application"] .border-dashed.border-gold-400\\/50').first();
        const zoneBorderBounds = await zoneBorder.boundingBox().catch(() => null);

        const result = {
          zone: zoneName,
          logo: logoBounds,
          zoneOverlay: zoneBorderBounds,
          canvas: canvasBounds,
        };

        // Check if logo is within the canvas bounds
        if (logoBounds && canvasBounds) {
          const logoWithinCanvas = (
            logoBounds.x >= canvasBounds.x - 5 &&
            logoBounds.y >= canvasBounds.y - 5 &&
            logoBounds.x + logoBounds.width <= canvasBounds.x + canvasBounds.width + 5 &&
            logoBounds.y + logoBounds.height <= canvasBounds.y + canvasBounds.height + 5
          );
          result.logoWithinCanvas = logoWithinCanvas;

          // Check if logo is within zone overlay
          if (zoneBorderBounds) {
            const logoWithinZone = (
              logoBounds.x >= zoneBorderBounds.x - 10 &&
              logoBounds.y >= zoneBorderBounds.y - 10 &&
              logoBounds.x + logoBounds.width <= zoneBorderBounds.x + zoneBorderBounds.width + 10 &&
              logoBounds.y + logoBounds.height <= zoneBorderBounds.y + zoneBorderBounds.height + 10
            );
            result.logoWithinZone = logoWithinZone;
          }
        }

        results.push(result);
        console.log(`\n--- ${zoneName} ---`);
        console.log(`  Logo: x=${logoBounds?.x?.toFixed(0)}, y=${logoBounds?.y?.toFixed(0)}, w=${logoBounds?.width?.toFixed(0)}, h=${logoBounds?.height?.toFixed(0)}`);
        console.log(`  Zone: x=${zoneBorderBounds?.x?.toFixed(0)}, y=${zoneBorderBounds?.y?.toFixed(0)}, w=${zoneBorderBounds?.width?.toFixed(0)}, h=${zoneBorderBounds?.height?.toFixed(0)}`);
        console.log(`  Within canvas: ${result.logoWithinCanvas}`);
        console.log(`  Within zone: ${result.logoWithinZone}`);
      }
    }

    // Assertions
    for (const r of results) {
      expect(r.logoWithinCanvas, `${r.zone}: Logo should be within canvas`).toBe(true);
      if (r.logoWithinZone !== undefined) {
        expect(r.logoWithinZone, `${r.zone}: Logo should be within zone bounds`).toBe(true);
      }
    }

    // Cleanup
    fs.unlinkSync(tempLogoPath);
  });
});
