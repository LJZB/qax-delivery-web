import { expect, test } from '@playwright/test';

test('arrastra el panel hacia el target', async ({ page }) => {
  await page.goto('https://bonigarcia.dev/selenium-webdriver-java/drag-and-drop.html');

  // La página usa jQuery UI: #draggable es el elemento arrastrable y #target el destino.
  const draggablePanel = page.locator('#draggable');
  const target = page.locator('#target');

  await expect(draggablePanel).toContainText('Drag me');
  await expect(target).toBeVisible();

  await draggablePanel.dragTo(target);

  // Verifica por coordenadas que el panel terminó dentro del área destino.
  const panelBox = await draggablePanel.boundingBox();
  const targetBox = await target.boundingBox();

  expect(panelBox).not.toBeNull();
  expect(targetBox).not.toBeNull();
  expect(panelBox!.x).toBeGreaterThanOrEqual(targetBox!.x);
  expect(panelBox!.x).toBeLessThanOrEqual(targetBox!.x + targetBox!.width);
});
