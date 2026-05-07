import { test, expect } from '@playwright/test';

test.describe('Canvas Zoom Feature Test', () => {

  test('Zoom controls are visible and functional', async ({ page }) => {
    await page.goto(`/customize/ts-black-01`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check zoom controls exist
    const zoomIn = page.getByLabel('Zoom in');
    const zoomOut = page.getByLabel('Zoom out');
    await expect(zoomIn).toBeVisible();
    await expect(zoomOut).toBeVisible();

    // Check initial zoom is 100%
    const zoomLabel = page.locator('button:has-text("100%")');
    await expect(zoomLabel).toBeVisible();

    await page.screenshot({ path: 'tests/screenshots/zoom-01-initial.png', fullPage: true });

    // Click zoom in
    await zoomIn.click();
    await page.waitForTimeout(400);
    
    const zoomLabel125 = page.locator('button:has-text("125%")');
    await expect(zoomLabel125).toBeVisible();
    console.log('Zoomed to 125%');

    await page.screenshot({ path: 'tests/screenshots/zoom-02-125-percent.png', fullPage: true });

    // Click zoom in again
    await zoomIn.click();
    await page.waitForTimeout(400);
    
    const zoomLabel150 = page.locator('button:has-text("150%")');
    await expect(zoomLabel150).toBeVisible();
    console.log('Zoomed to 150%');

    // Check pan hint appears
    const panHint = page.locator('text=Ctrl+Scroll to zoom');
    await expect(panHint).toBeVisible();

    await page.screenshot({ path: 'tests/screenshots/zoom-03-150-percent.png', fullPage: true });

    // Zoom to max (300%)
    await zoomIn.click(); // 175%
    await zoomIn.click(); // 200%
    await zoomIn.click(); // 225%
    await zoomIn.click(); // 250%
    await zoomIn.click(); // 275%
    await zoomIn.click(); // 300%
    await page.waitForTimeout(400);

    const zoomLabel300 = page.locator('button:has-text("300%")');
    await expect(zoomLabel300).toBeVisible();
    console.log('Zoomed to 300%');

    // Zoom in button should be disabled at max
    await expect(zoomIn).toBeDisabled();

    await page.screenshot({ path: 'tests/screenshots/zoom-04-300-percent-max.png', fullPage: true });

    // Click zoom percentage to reset
    await zoomLabel300.click();
    await page.waitForTimeout(400);

    const zoomLabelReset = page.locator('button:has-text("100%")');
    await expect(zoomLabelReset).toBeVisible();
    console.log('Reset to 100%');

    await page.screenshot({ path: 'tests/screenshots/zoom-05-reset.png', fullPage: true });
  });

  test('Zoom with uploaded logo for minute detail editing', async ({ page }) => {
    await page.goto(`/customize/ts-black-01`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Upload logo
    const fileInput = page.locator('input[type="file"]');
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAA' +
      'BZ0RVh0Q3JlYXRpb24gVGltZQAxMC8yOS8xMiKKq3kAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAA' +
      'ADgklEQVRoge2aT2hTQRDGf5O8JDXaGkEERYQi1oKCePAioj14ELx48SgIXkTw4EmLN0/ixYtHD4Lg0ZuIB1EQhYogWhVE' +
      'RUEFqa1//tmkzXs7s8/NvjRN2uZ9MMwy+2dn3+7szszblyBJDFYkB9qAXqXfDfC/RRxoA3qVhAN9QEhIMMBn5FBD0k/9asDN' +
      'wHvgI7C2lVb0QiYIuQgcAJ4CZ4FHwK5edNYq7kbeADPAeeA0sOjnX+AJ8By4CnwFNgEz7cxlOyQD7AO2AEeAfcBNwBngGH' +
      'DHRX4BmYBz4AvwHfge7AMWAWuAXcAzwBPnQ5mNqQTIWM2AMuBM4H9wL5u9dMGngDvAG+BL0AKpIHPQf5uwB1gH9gNngcO2n' +
      'bYEQHwA7gOXgTPAOGBdt+F/BH4HLgBXgYvA9sD2DvxZa2cqkcWtwDJwB/gGWOmhvh3kbwf/e+AZ4APwGviKfgXqN1X8C2A' +
      'lcMB+Swa4iByGxr7a8CTwFngPfAIWtMuGTiUTeQwcBG4FjgDjXezrFfAE+RJ4B3wD5u32tPuL/A8GY+BNYD+wE9gEjHSpnz' +
      'awHHiJHIvmOAV0AjPAnLb5CJwHDhv23K+sNSQFvAB2AieBvcB6Y30ZeAh8Am4DN5Er0VyxNfMY+HdkT9Qmg70FXgeOArs0xx' +
      '6UpxroAB+ADcB5YJaB60lkL2QJOAHMBM4AW7ooP4W8hbwD3EY+Q/b3aYSN6Yvt4EVgD7ALGNNFeR+B68Bp4BKyG5j1wk+74' +
      'aPALmATsBfYBIzuYj+LgDPIPeAxcLab8nqRjiQTuQgcB04DW7vU0zvkJnITuAL8E2R3A/OBHUC/5/0FpiL/BH5G9u/B+kH+R' +
      '7gD7Ad2WnhvNjn4CXiM7IlLwN3A3SD3D/AP8C/gL+Af4F9u6aYhT4B7gN3ADmCk/79fgCXgMPAUcKVL8TmGx2PgB+RKdH8S' +
      'YvAOOArYYH5z8A/gDuA58F+QuwT8CtwC/kZWdKm/S+nICuB7YCdwELihi/I+AI+Bf4CLwO0g+2836EkykSfAg8Be4CRwqIvy' +
      'fgIPkMvIHuCqt3wYOAYcBI4D+4BxwPouy/0F3AMuAc+A84HN/0J+R5aB68BN4Cbwn9u+CwYAAAAASUVORK5CYII=',
      'base64'
    );

    await fileInput.setInputFiles({
      name: 'test-logo.png',
      mimeType: 'image/png',
      buffer: testImageBuffer,
    });

    await page.waitForTimeout(10000);

    // Set logo to small scale (15%)
    const scaleInput = page.locator('#ctrl-scale');
    if (await scaleInput.count() > 0) {
      await scaleInput.fill('15');
      await scaleInput.press('Tab');
      await page.waitForTimeout(500);
    }

    await page.screenshot({ path: 'tests/screenshots/zoom-06-small-logo-100.png', fullPage: true });

    // Now zoom in to 200% to see details
    const zoomIn = page.getByLabel('Zoom in');
    await zoomIn.click(); // 125%
    await zoomIn.click(); // 150%
    await zoomIn.click(); // 175%
    await zoomIn.click(); // 200%
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'tests/screenshots/zoom-07-small-logo-200.png', fullPage: true });
    console.log('Small logo at 200% zoom - details visible');

    // Zoom to 300%
    await zoomIn.click(); // 225%
    await zoomIn.click(); // 250%
    await zoomIn.click(); // 275%
    await zoomIn.click(); // 300%
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'tests/screenshots/zoom-08-small-logo-300.png', fullPage: true });
    console.log('Small logo at 300% zoom - maximum detail');
  });
});
