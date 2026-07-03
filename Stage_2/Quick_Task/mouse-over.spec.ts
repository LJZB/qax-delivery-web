import { expect, test } from '@playwright/test';

test('muestra el texto Compass al hacer mouse over', async ({ page }) => {
  await page.goto('https://bonigarcia.dev/selenium-webdriver-java/mouse-over.html');

  const compassFigure = page.locator('.figure').filter({ hasText: 'Compass' });
  const compassCaption = page.getByText('Compass');

  await expect(compassCaption).toBeHidden();
  await compassFigure.hover();

  await expect(compassCaption).toBeVisible();
});
