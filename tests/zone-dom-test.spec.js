import { test } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test.describe('Zone DOM Analysis', () => {
  test.use({ baseURL: 'http://localhost:5173' });
  test.setTimeout(60000);

  test('Analyze logo and zone DOM positions', async ({ page }) => {
    await page.goto('/customize/ts-black-01?size=M');
    await page.waitForLoadState('networkidle');

    // Dismiss cookie
    const cookieBtn = page.locator('button:has-text("Accept"), button:has-text("Got it")').first();
    if (await cookieBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await cookieBtn.click();
      await page.waitForTimeout(500);
    }

    await page.waitForSelector('[role="application"]', { timeout: 10000 });

    // Upload logo
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
      ctx.fillText('TEST', 100, 100);
      return canvas.toDataURL('image/png');
    });

    const base64Data = testImageDataUrl.replace(/^data:image\/png;base64,/, '');
    const tempLogoPath = path.join(__dirname, 'screenshots', 'temp-dom-logo.png');
    fs.mkdirSync(path.dirname(tempLogoPath), { recursive: true });
    fs.writeFileSync(tempLogoPath, Buffer.from(base64Data, 'base64'));

    await page.locator('input[type="file"]').setInputFiles(tempLogoPath);
    await page.waitForTimeout(2000);

    const zones = ['Left Chest', 'Center Chest', 'Right Chest', 'Full Front', 'Lower Front'];

    for (const zoneName of zones) {
      const zoneBtn = page.locator(`[aria-label="${zoneName} placement zone"]`).last();
      if (await zoneBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await zoneBtn.click({ force: true });
        await page.waitForTimeout(1200);

        // Comprehensive DOM analysis inside the canvas
        const analysis = await page.evaluate((zn) => {
          const canvas = document.querySelector('[role="application"]');
          if (!canvas) return { error: 'No canvas found' };

          const canvasRect = canvas.getBoundingClientRect();
          
          // Find all images with alt="Custom Design"
          const logos = canvas.querySelectorAll('img[alt="Custom Design"]');
          const logoData = Array.from(logos).map(logo => {
            const rect = logo.getBoundingClientRect();
            const parent = logo.closest('[style]');
            return {
              rect: { x: rect.x, y: rect.y, w: rect.width, h: rect.height },
              parentStyle: parent?.getAttribute('style') || 'none',
              parentClass: parent?.className || 'none',
            };
          });

          // Find zone overlay (gold dashed border)
          const zoneOverlays = canvas.querySelectorAll('.border-dashed');
          const overlayData = Array.from(zoneOverlays).map(el => {
            const rect = el.getBoundingClientRect();
            return {
              rect: { x: rect.x, y: rect.y, w: rect.width, h: rect.height },
              style: el.getAttribute('style'),
              classes: el.className.substring(0, 100),
            };
          });

          // Find the t-shirt image
          const tshirtImg = canvas.querySelector('img[alt="Front"]') || canvas.querySelector('img[alt*="T-shirt"]') || canvas.querySelector('img:not([alt="Custom Design"])');
          const tshirtRect = tshirtImg ? tshirtImg.getBoundingClientRect() : null;

          // Get the print area container (inset-6/inset-10)
          const printArea = canvas.querySelector('.pointer-events-none');
          const printAreaRect = printArea ? printArea.getBoundingClientRect() : null;

          return {
            zone: zn,
            canvas: { x: canvasRect.x, y: canvasRect.y, w: canvasRect.width, h: canvasRect.height },
            tshirt: tshirtRect ? { x: tshirtRect.x, y: tshirtRect.y, w: tshirtRect.width, h: tshirtRect.height } : null,
            printArea: printAreaRect ? { x: printAreaRect.x, y: printAreaRect.y, w: printAreaRect.width, h: printAreaRect.height } : null,
            logos: logoData,
            overlays: overlayData,
          };
        }, zoneName);

        console.log(`\n====== ${zoneName} ======`);
        console.log('Canvas:', JSON.stringify(analysis.canvas));
        console.log('T-Shirt Image:', JSON.stringify(analysis.tshirt));
        console.log('Print Area:', JSON.stringify(analysis.printArea));
        console.log('Logos:', JSON.stringify(analysis.logos, null, 2));
        console.log('Zone Overlays:', JSON.stringify(analysis.overlays, null, 2));

        // Take targeted screenshot of just the canvas
        const canvasEl = page.locator('[role="application"]').first();
        await canvasEl.screenshot({ path: `tests/screenshots/dom-${zoneName.toLowerCase().replace(' ', '-')}.png` });
      }
    }

    fs.unlinkSync(tempLogoPath);
  });
});
