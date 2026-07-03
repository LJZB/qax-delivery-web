import { expect, test } from '@playwright/test';

test('arrastra el panel hacia el target', async ({ page }) => {
  await page.goto('https://bonigarcia.dev/selenium-webdriver-java/drag-and-drop.html');

  const draggablePanel = page.locator('#draggable');
  const target = page.locator('#target');

  await expect(draggablePanel).toContainText('Drag me');
  await expect(target).toBeVisible();

  await draggablePanel.dragTo(target);

  const panelBox = await draggablePanel.boundingBox();
  const targetBox = await target.boundingBox();

  expect(panelBox).not.toBeNull();
  expect(targetBox).not.toBeNull();
  expect(panelBox!.x).toBeGreaterThanOrEqual(targetBox!.x);
  expect(panelBox!.x).toBeLessThanOrEqual(targetBox!.x + targetBox!.width);
});
