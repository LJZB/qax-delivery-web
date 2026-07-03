import { expect, test } from '@playwright/test';

test('muestra el texto Compass al hacer mouse over', async ({ page }) => {
  await page.goto('https://bonigarcia.dev/selenium-webdriver-java/mouse-over.html');

  // La caption está dentro del contenedor .figure y solo aparece al hacer hover.
  const compassFigure = page.locator('.figure').filter({ hasText: 'Compass' });
  const compassCaption = page.getByText('Compass');

  await expect(compassCaption).toBeHidden();
  // Simula pasar el mouse sobre la imagen para activar la regla CSS :hover.
  await compassFigure.hover();

  await expect(compassCaption).toBeVisible();
});
