import { expect, test } from '@playwright/test';

test('click forzado en Start de Get user media', async ({ page, context }) => {
  await context.grantPermissions(['camera', 'microphone']);

  await page.goto('https://bonigarcia.dev/selenium-webdriver-java/get-user-media.html');

  const startButton = page.getByRole('button', { name: 'Start' });
  const video = page.locator('#my-video');
  const videoDevice = page.locator('#video-device');

  await expect(startButton).toBeVisible();
  await startButton.click({ force: true });

  await expect(video).toBeVisible();
  await expect(videoDevice).toContainText('Using video device:');
});
