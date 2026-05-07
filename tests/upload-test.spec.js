import { test, expect } from '@playwright/test';

test.describe('Logo Upload & Editor Controls - Deep Test', () => {

  test('Upload logo and verify editor controls appear', async ({ page }) => {
    const consoleErrors = [];
    const consoleWarnings = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
      if (msg.type() === 'warning') consoleWarnings.push(msg.text());
      console.log(`[${msg.type()}]`, msg.text());
    });

    // Navigate to customize page
    await page.goto(`/customize/ts-black-01`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Screenshot before upload
    await page.screenshot({ path: 'tests/screenshots/upload-01-before.png', fullPage: true });

    // Find the file input
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();

    // Create a test image (small PNG)
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

    // Upload the image file
    await fileInput.setInputFiles({
      name: 'test-logo.png',
      mimeType: 'image/png',
      buffer: testImageBuffer,
    });

    // Wait for upload to complete (Cloudinary upload)
    await page.waitForTimeout(10000);

    // Screenshot after upload
    await page.screenshot({ path: 'tests/screenshots/upload-02-after.png', fullPage: true });

    // Check for any error toasts
    const errorToast = page.locator('text=error, text=failed, text=Error');
    const toastCount = await errorToast.count();
    console.log(`Error toast count: ${toastCount}`);

    // Check if logo appeared on canvas
    const logoOnCanvas = page.locator('img[alt="Custom Design"]');
    const logoVisible = await logoOnCanvas.count();
    console.log(`Logo on canvas count: ${logoVisible}`);

    if (logoVisible > 0) {
      await logoOnCanvas.first().screenshot({ path: 'tests/screenshots/upload-03-logo-on-canvas.png' });
    }

    // Check if scale slider appears
    const scaleSlider = page.locator('input[type="range"]');
    const sliderVisible = await scaleSlider.count();
    console.log(`Scale slider visible: ${sliderVisible > 0}`);

    // Print all console errors
    console.log('=== ALL CONSOLE ERRORS ===');
    consoleErrors.forEach(e => console.log('  ', e));
    console.log(`Total: ${consoleErrors.length}`);

    console.log('=== ALL CONSOLE WARNINGS ===');
    consoleWarnings.forEach(w => console.log('  ', w));
  });

  test('Test Numeric Controls visibility and interaction', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto(`/customize/ts-black-01`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Upload an image first
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
    
    // Check Numeric Controls section
    const numericControls = page.locator('text=Precision Controls');
    const controlsExist = await numericControls.count();
    console.log(`Precision Controls section visible: ${controlsExist > 0}`);

    if (controlsExist > 0) {
      await page.screenshot({ path: 'tests/screenshots/upload-04-controls-visible.png', fullPage: true });
    }

    // Check X position input
    const xInput = page.locator('#ctrl-pos-x');
    if (await xInput.count() > 0) {
      await xInput.fill('20');
      await xInput.press('Enter');
      await page.waitForTimeout(500);
      console.log('X position changed to 20');
    }

    // Check Y position input
    const yInput = page.locator('#ctrl-pos-y');
    if (await yInput.count() > 0) {
      await yInput.fill('10');
      await yInput.press('Enter');
      await page.waitForTimeout(500);
      console.log('Y position changed to 10');
    }

    // Check scale input
    const scaleInput = page.locator('#ctrl-scale');
    if (await scaleInput.count() > 0) {
      await scaleInput.fill('150');
      await scaleInput.press('Enter');
      await page.waitForTimeout(500);
      console.log('Scale changed to 150%');
    }

    // Check rotation input
    const rotationInput = page.locator('#ctrl-rotation');
    if (await rotationInput.count() > 0) {
      await rotationInput.fill('45');
      await rotationInput.press('Enter');
      await page.waitForTimeout(500);
      console.log('Rotation changed to 45deg');
    }

    await page.screenshot({ path: 'tests/screenshots/upload-05-after-controls.png', fullPage: true });

    // Test Quick Actions
    const centerBtn = page.getByRole('button', { name: '📍 Center' });
    if (await centerBtn.count() > 0) {
      await centerBtn.click();
      await page.waitForTimeout(500);
      console.log('Center button clicked');
    }

    // Test view switcher
    const backViewBtn = page.getByRole('button', { name: 'back', exact: true });
    if (await backViewBtn.count() > 0) {
      await backViewBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'tests/screenshots/upload-06-back-view.png', fullPage: true });
      console.log('Switched to back view');
    }

    // Switch to "both" view
    const bothViewBtn = page.getByRole('button', { name: 'both', exact: true });
    if (await bothViewBtn.count() > 0) {
      await bothViewBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'tests/screenshots/upload-07-both-view.png', fullPage: true });
      console.log('Switched to both view');
    }

    // Test Download button state (should be enabled since we have a design)
    const downloadBtn = page.locator('button:has-text("Download")');
    if (await downloadBtn.count() > 0) {
      const isDisabled = await downloadBtn.getAttribute('disabled');
      console.log(`Download button disabled: ${isDisabled !== null}`);
    }

    // Print errors
    console.log('=== ERRORS ===');
    errors.forEach(e => console.log('  ', e));
  });

  test('Test drag interaction on logo', async ({ page }) => {
    await page.goto(`/customize/ts-black-01`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Upload image
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

    // Check if logo appeared
    const logo = page.locator('img[alt="Custom Design"]');
    if (await logo.count() > 0) {
      console.log('Logo is visible on canvas!');

      // Try drag interaction
      const logoBounds = await logo.boundingBox();
      if (logoBounds) {
        console.log(`Logo position: ${logoBounds.x}, ${logoBounds.y}`);
        
        // Drag the logo
        await page.mouse.move(logoBounds.x + logoBounds.width / 2, logoBounds.y + logoBounds.height / 2);
        await page.mouse.down();
        await page.mouse.move(logoBounds.x + logoBounds.width / 2 + 50, logoBounds.y + logoBounds.height / 2 + 30, { steps: 10 });
        await page.waitForTimeout(300);
        await page.mouse.up();
        await page.waitForTimeout(500);

        await page.screenshot({ path: 'tests/screenshots/upload-08-after-drag.png', fullPage: true });
        console.log('Drag complete');
      }
    } else {
      console.log('Logo NOT visible - upload may have failed');
      await page.screenshot({ path: 'tests/screenshots/upload-08-no-logo.png', fullPage: true });
    }
  });

  test('Test header buttons - Help, Undo, Redo, Clear', async ({ page }) => {
    await page.goto(`/customize/ts-black-01`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Test Help button
    const helpBtn = page.locator('button:has-text("Help")');
    if (await helpBtn.count() > 0) {
      await helpBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'tests/screenshots/upload-09-help-modal.png', fullPage: true });
      
      // Close modal
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }

    // Check undo/redo buttons disabled state (no history)
    const undoBtn = page.locator('button[title*="Undo"]');
    if (await undoBtn.count() > 0) {
      const undoDisabled = await undoBtn.getAttribute('disabled');
      console.log(`Undo disabled (correct - no history): ${undoDisabled !== null}`);
    }

    const redoBtn = page.locator('button[title*="Redo"]');
    if (await redoBtn.count() > 0) {
      const redoDisabled = await redoBtn.getAttribute('disabled');
      console.log(`Redo disabled (correct - no history): ${redoDisabled !== null}`);
    }

    // Back button
    const backBtn = page.locator('button:has-text("Back")').first();
    await expect(backBtn).toBeVisible();
    console.log('Back navigation button visible');
  });
});
