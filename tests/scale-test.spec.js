import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5174';

test.describe('Scale Limit Fix Verification', () => {

  test('Logo scale can go below 30% down to 10%', async ({ page }) => {
    await page.goto(`${BASE_URL}/customize/ts-black-01`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Upload a logo first
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

    // Wait for upload
    await page.waitForTimeout(10000);

    // Find the scale numeric control
    const scaleInput = page.locator('#ctrl-scale');
    await expect(scaleInput).toBeVisible();

    // Test setting scale to 10% (should work now)
    await scaleInput.fill('10');
    await scaleInput.press('Tab');
    await page.waitForTimeout(500);

    const scaleValue = await scaleInput.inputValue();
    console.log(`Scale value after setting to 10: ${scaleValue}`);
    expect(parseInt(scaleValue)).toBe(10);

    await page.screenshot({ path: 'tests/screenshots/scale-01-at-10-percent.png', fullPage: true });

    // Test setting scale to 15%
    await scaleInput.fill('15');
    await scaleInput.press('Tab');
    await page.waitForTimeout(500);

    const scaleValue15 = await scaleInput.inputValue();
    console.log(`Scale value after setting to 15: ${scaleValue15}`);
    expect(parseInt(scaleValue15)).toBe(15);

    // Test setting scale to 5% (should clamp to 10%)
    await scaleInput.fill('5');
    await scaleInput.press('Tab');
    await page.waitForTimeout(500);

    const scaleValue5 = await scaleInput.inputValue();
    console.log(`Scale value after setting to 5 (should clamp to 10): ${scaleValue5}`);
    expect(parseInt(scaleValue5)).toBe(10);

    // Test the slider in UploadLogo (range input)
    const rangeSlider = page.locator('input[type="range"]');
    if (await rangeSlider.count() > 0) {
      const minAttr = await rangeSlider.getAttribute('min');
      console.log(`Range slider min attribute: ${minAttr}`);
      expect(minAttr).toBe('0.1');

      // Set slider to minimum
      await rangeSlider.fill('0.1');
      await page.waitForTimeout(500);
      
      await page.screenshot({ path: 'tests/screenshots/scale-02-slider-at-min.png', fullPage: true });
      console.log('Slider set to 0.1 (10%) successfully');
    }

    // Test 20% scale
    await scaleInput.fill('20');
    await scaleInput.press('Tab');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tests/screenshots/scale-03-at-20-percent.png', fullPage: true });
    console.log('Scale at 20% - logo should be visibly small');
  });
});
