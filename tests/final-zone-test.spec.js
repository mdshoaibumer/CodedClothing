import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test.describe('Final Zone Rendering Verification', () => {
  test.use({ baseURL: 'http://localhost:5173' });
  test.setTimeout(60000);

  test('All zones render logo in correct position via store', async ({ page }) => {
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
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ff6600';
      ctx.beginPath();
      ctx.arc(150, 150, 140, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 50px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('CC', 150, 150);
      return canvas.toDataURL('image/png');
    });

    const base64Data = testImageDataUrl.replace(/^data:image\/png;base64,/, '');
    const tempLogoPath = path.join(__dirname, 'screenshots', 'temp-final-logo.png');
    fs.mkdirSync(path.dirname(tempLogoPath), { recursive: true });
    fs.writeFileSync(tempLogoPath, Buffer.from(base64Data, 'base64'));
    await page.locator('input[type="file"]').setInputFiles(tempLogoPath);
    await page.waitForTimeout(2000);

    // For each zone, navigate fresh to avoid state issues
    const zones = [
      { id: 'left-chest', name: 'Left Chest', expectedBox: 'left: 18%; top: 28%; width: 25%; height: 20%' },
      { id: 'right-chest', name: 'Right Chest', expectedBox: 'left: 57%; top: 28%; width: 25%; height: 20%' },
      { id: 'center-chest', name: 'Center Chest', expectedBox: 'left: 25%; top: 27%; width: 50%; height: 25%' },
      { id: 'full-front', name: 'Full Front', expectedBox: 'left: 15%; top: 25%; width: 70%; height: 50%' },
      { id: 'lower-front', name: 'Lower Front', expectedBox: 'left: 22%; top: 50%; width: 56%; height: 25%' },
    ];

    const results = [];

    for (const zone of zones) {
      // Navigate fresh for each zone to avoid state carryover
      await page.goto('/customize/ts-black-01?size=M');
      await page.waitForLoadState('networkidle');
      
      // Dismiss cookie again if needed
      const cb = page.locator('button:has-text("Accept"), button:has-text("Got it")').first();
      if (await cb.isVisible({ timeout: 1500 }).catch(() => false)) {
        await cb.click();
        await page.waitForTimeout(300);
      }
      await page.waitForSelector('[role="application"]', { timeout: 10000 });
      
      // Re-upload logo
      await page.locator('input[type="file"]').setInputFiles(tempLogoPath);
      await page.waitForTimeout(1500);

      // Click the zone button in the list (not silhouette) - more reliable
      // Use exact text match by targeting the button with zone label inside
      const listBtn = page.locator(`button`).filter({ hasText: new RegExp(`^.*${zone.name}.*$`) });
      const count = await listBtn.count();
      
      // Click the last matching button (list button, not silhouette)
      if (count > 0) {
        await listBtn.nth(count - 1).click({ force: true });
      }
      await page.waitForTimeout(1000);

      // Verify zone state via DOM
      const analysis = await page.evaluate(() => {
        const canvas = document.querySelector('[role="application"]');
        const zoneLabel = canvas?.querySelector('.bg-gold-500\\/90');
        const zoneBorder = canvas?.querySelector('.border-gold-400\\/50');
        const logo = canvas?.querySelector('img[alt="Custom Design"]');
        const logoContainer = logo?.closest('[role="img"]');
        
        return {
          zoneLabelText: zoneLabel?.textContent?.trim() || 'none',
          zoneBorderStyle: zoneBorder?.getAttribute('style') || 'no-zone-active',
          logoContainerStyle: logoContainer?.getAttribute('style') || 'no-container',
          logoRect: logo?.getBoundingClientRect() || null,
        };
      });

      results.push({ zone: zone.name, ...analysis });
      console.log(`\n=== ${zone.name} ===`);
      console.log(`  Zone Label: ${analysis.zoneLabelText}`);
      console.log(`  Zone Border: ${analysis.zoneBorderStyle}`);
      console.log(`  Logo Container: ${analysis.logoContainerStyle}`);

      // Screenshot
      await page.locator('[role="application"]').first().screenshot({
        path: `tests/screenshots/final-${zone.id}.png`
      });
    }

    // Verify all zones applied correctly
    for (let i = 0; i < zones.length; i++) {
      const zone = zones[i];
      const result = results[i];
      
      console.log(`\nVerifying ${zone.name}...`);
      console.log(`  Expected: ${zone.expectedBox}`);
      console.log(`  Got border: ${result.zoneBorderStyle}`);
      console.log(`  Got container: ${result.logoContainerStyle}`);
      
      // Check zone label shows the correct zone
      expect(result.zoneLabelText, `${zone.name}: zone label should contain zone name`).toContain(zone.name);
      // Check logo container position matches zone bounding box
      expect(result.logoContainerStyle, `${zone.name}: logo should be positioned at zone bounds`).toContain(zone.expectedBox);
    }

    fs.unlinkSync(tempLogoPath);
  });
});
