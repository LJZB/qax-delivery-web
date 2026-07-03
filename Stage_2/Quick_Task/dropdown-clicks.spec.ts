import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Todos los casos usan la misma página de dropdowns.
  await page.goto('https://bonigarcia.dev/selenium-webdriver-java/dropdown-menu.html');
});

test('abre el dropdown con left click', async ({ page }) => {
  // Se filtra el contenedor para evitar mezclar opciones repetidas de otros menús.
  const leftDropdown = page.locator('.dropdown').filter({
    has: page.getByRole('button', { name: 'Use left-click here' }),
  });
  const leftButton = leftDropdown.getByRole('button', { name: 'Use left-click here' });
  const actionOption = leftDropdown.getByRole('link', { name: 'Action', exact: true });

  await expect(actionOption).toBeHidden();
  await leftButton.click();

  await expect(actionOption).toBeVisible();
});

test('abre el menú contextual con click derecho', async ({ page }) => {
  const rightButton = page.getByRole('button', { name: 'Use right-click here' });
  const contextMenu = page.locator('#context-menu-2');
  const anotherAction = contextMenu.getByRole('link', { name: 'Another action' });

  await expect(contextMenu).toBeHidden();
  // button: 'right' simula click derecho y dispara el menú contextual custom.
  await rightButton.click({ button: 'right' });

  await expect(contextMenu).toBeVisible();
  await expect(anotherAction).toBeVisible();
});

test('abre el menú con doble click', async ({ page }) => {
  const doubleClickButton = page.getByRole('button', { name: 'Use double-click here' });
  const doubleClickMenu = page.locator('#context-menu-3');
  const separatedLink = doubleClickMenu.getByRole('link', { name: 'Separated link' });

  await expect(doubleClickMenu).toBeHidden();
  // dblclick ejecuta un doble click real, no dos clicks separados.
  await doubleClickButton.dblclick();

  await expect(doubleClickMenu).toBeVisible();
  await expect(separatedLink).toBeVisible();
});
