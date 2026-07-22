import { test, expect, type Locator, type Page } from '@playwright/test';
import {
  generateRandomEmail,
  generateRandomName,
} from './utils/dataGenerator';

async function waitForCheckoutStepOrPauseForLogin(
  page: Page,
  expectedCheckoutStep: Locator,
) {
  // Bloque de autenticación reforzada:
  // Espera hasta que aparezca el siguiente paso o Mercado Libre solicite nuevamente el login.
  const loginHeading = page.getByRole('heading', {
    name: 'Ingresa tu e-mail o teléfono para iniciar sesión',
  });

  await expect(loginHeading.or(expectedCheckoutStep)).toBeVisible({
    timeout: 15_000,
  });

  if (await loginHeading.isVisible()) {
    // La pausa permite completar manualmente contraseña, 2FA o llave de seguridad.
    // Después del ingreso, se debe pulsar Resume en Playwright Inspector.
    await page.pause();

    // Bloque de retorno al checkout:
    // Verifica que la autenticación manual devolvió la navegación al paso esperado.
    await expect(expectedCheckoutStep).toBeVisible({ timeout: 30_000 });
  }
}

test('llega hasta la pantalla de pagos de Mercado Libre', async ({ page }, testInfo) => {
  // Bloque de datos:
  // Genera datos únicos y los adjunta al reporte para identificar esta ejecución.
  const dynamicUser = {
    name: generateRandomName(),
    email: generateRandomEmail(),
  };

  await testInfo.attach('datos-dinamicos', {
    body: JSON.stringify(dynamicUser, null, 2),
    contentType: 'application/json',
  });

  // Bloque de preparación:
  // Abre directamente Mercado Libre Colombia con la sesión local previamente guardada.
  await page.goto('https://www.mercadolibre.com.co/');

  // Bloque de acción:
  // Busca el mismo producto utilizado durante la exploración real con Codegen.
  const searchBox = page.getByRole('combobox', {
    name: 'Ingresa lo que quieras',
  });

  await searchBox.fill('play station 5');
  await searchBox.press('Enter');

  const product = page
    .getByRole('link', {
      name: 'Consola PlayStation 5 Pro 2TB SSD',
      exact: true,
    })
    .first();

  await expect(product).toBeVisible();
  await product.click();

  // Bloque de verificación del producto:
  // Confirma que el producto observado realmente permite iniciar el proceso de compra.
  const buyButton = page.getByRole('button', { name: 'Comprar ahora' });
  await expect(buyButton).toBeVisible();
  await buyButton.click();

  // Bloque de navegación de entrega:
  // Avanza por las dos pantallas verificadas manualmente sin modificar domicilio ni fecha.
  const continueButton = page.getByTestId('shipping_footer_confirm_button');
  const shippingForm = page.getByText('Revisa la forma de entrega');
  const deliveryDate = page.getByText('Elige cuándo llega tu compra');

  await waitForCheckoutStepOrPauseForLogin(page, shippingForm);
  await continueButton.click();

  // Bloque de verificación posterior al login:
  // Confirma que Mercado Libre devolvió el flujo a la selección de entrega.
  await waitForCheckoutStepOrPauseForLogin(page, deliveryDate);
  await continueButton.click();

  // Bloque de verificación final:
  // Demuestra que el flujo llegó a pagos y se detiene antes de seleccionar o confirmar uno.
  await expect(
    page.getByRole('heading', { name: 'Elige cómo pagar' }),
  ).toBeVisible();
});
