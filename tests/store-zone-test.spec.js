import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test.describe('Direct Store Zone Test', () => {
  test.use({ baseURL: 'http://localhost:5173' });
  test.setTimeout(60000);

  test('Verify logo rendering by directly setting store state', async ({ page }) => {
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
    const tempLogoPath = path.join(__dirname, 'screenshots', 'temp-store-logo.png');
    fs.mkdirSync(path.dirname(tempLogoPath), { recursive: true });
    fs.writeFileSync(tempLogoPath, Buffer.from(base64Data, 'base64'));
    await page.locator('input[type="file"]').setInputFiles(tempLogoPath);
    await page.waitForTimeout(2000);

    // DIRECTLY apply zones via Zustand store (bypass UI click issues)
    const zones = [
      { id: 'left-chest', name: 'Left Chest' },
      { id: 'right-chest', name: 'Right Chest' },
      { id: 'center-chest', name: 'Center Chest' },
      { id: 'full-front', name: 'Full Front' },
      { id: 'lower-front', name: 'Lower Front' },
    ];

    for (const zone of zones) {
      // Apply zone directly via store
      await page.evaluate((zoneId) => {
        // Access Zustand store via the React fiber/internals or window
        // The store is imported via module system, so we need to use the devtools API
        // or trigger it through the component
        const event = new CustomEvent('__test_apply_zone', { detail: { zoneId } });
        window.dispatchEvent(event);
      }, zone.id);

      // Fallback: click the zone button with a more specific selector
      // Use the sidebar button list (non-silhouette buttons)
      const sidebarBtn = page.locator(`button`).filter({ hasText: zone.name }).last();
      if (await sidebarBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await sidebarBtn.click({ force: true, position: { x: 5, y: 5 } });
      }
      await page.waitForTimeout(1000);

      // Check store state
      const storeState = await page.evaluate(() => {
        // Try to get the store state from React component tree
        const root = document.getElementById('root');
        const fiber = root?._reactRootContainer?._internalRoot?.current || root?.__reactFiber$;
        // Alternative: check DOM for zone indicators
        const zoneLabel = document.querySelector('[role="application"] .bg-gold-500\\/90');
        const zoneBorder = document.querySelector('[role="application"] .border-gold-400\\/50');
        const logo = document.querySelector('[role="application"] img[alt="Custom Design"]');
        
        return {
          zoneLabelText: zoneLabel?.textContent || 'none',
          zoneBorderStyle: zoneBorder?.getAttribute('style') || 'none',
          logoParentStyle: logo?.parentElement?.parentElement?.getAttribute('style') || 'none',
          logoContainerStyle: logo?.closest('[role="img"]')?.getAttribute('style') || 'none',
          logoRect: logo ? logo.getBoundingClientRect() : null,
        };
      });

      console.log(`\n=== ${zone.name} (${zone.id}) ===`);
      console.log('Zone Label:', storeState.zoneLabelText);
      console.log('Zone Border Style:', storeState.zoneBorderStyle);
      console.log('Logo Container Style:', storeState.logoContainerStyle);
      console.log('Logo Rect:', JSON.stringify(storeState.logoRect));

      // Take canvas screenshot
      await page.locator('[role="application"]').first().screenshot({
        path: `tests/screenshots/store-${zone.id}.png`
      });
    }

    fs.unlinkSync(tempLogoPath);
  });
});
