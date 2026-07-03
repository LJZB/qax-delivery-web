import { expect, test } from '@playwright/test';

test('click forzado en Start de Get user media', async ({ page, context }) => {
  // Concede permisos antes del click para evitar el popup nativo del navegador.
  await context.grantPermissions(['camera', 'microphone']);

  await page.goto('https://bonigarcia.dev/selenium-webdriver-java/get-user-media.html');

  // Start es un botón visible; videoDevice muestra el nombre del dispositivo activado.
  const startButton = page.getByRole('button', { name: 'Start' });
  const video = page.locator('#my-video');
  const videoDevice = page.locator('#video-device');

  await expect(startButton).toBeVisible();
  // Se usa force porque el objetivo del ejercicio es practicar click forzado.
  await startButton.click({ force: true });

  await expect(video).toBeVisible();
  await expect(videoDevice).toContainText('Using video device:');
});
