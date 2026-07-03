import { expect, test } from '@playwright/test';

test('descarga el logo de WebDriverManager', async ({ page }) => {
  await page.goto('https://bonigarcia.dev/selenium-webdriver-java/download.html');

  // La pagina del enunciado descarga archivos; no contiene input type="file" para subir.
  const webDriverManagerLogo = page.getByRole('link', { name: 'WebDriverManager logo' });

  // Primero se prepara la espera de descarga y luego se dispara con el click.
  const downloadPromise = page.waitForEvent('download');
  await webDriverManagerLogo.click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe('webdrivermanager.png');
});
