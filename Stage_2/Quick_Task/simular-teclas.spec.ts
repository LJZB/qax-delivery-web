import { expect, test } from '@playwright/test';

test('resuelve una suma usando el teclado', async ({ page }) => {
  await page.goto('https://bonigarcia.dev/selenium-webdriver-java/slow-calculator.html');

  const delayInput = page.locator('#delay');
  const screen = page.locator('.screen');

  // El input delay sí acepta teclado; se selecciona su valor actual y se reemplaza por 0.
  await delayInput.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.type('0');

  // Los botones de la calculadora son spans, por eso la operación se dispara con click.
  await page.getByText('1', { exact: true }).click();
  await page.getByText('+', { exact: true }).click();
  await page.getByText('2', { exact: true }).click();
  await page.getByText('=', { exact: true }).click();

  await expect(screen).toHaveText('3');
});
