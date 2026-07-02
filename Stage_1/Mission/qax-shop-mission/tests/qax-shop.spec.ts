import { test, expect } from '@playwright/test';

// Datos esperados del producto usado en el flujo principal de compra.
const productName = 'Café Colombiano Premium 500g';
const productSearch = 'afé';
const productPrice = '$ 45.000 COP';

// Datos de prueba para completar el formulario de checkout con información válida.
const checkoutData = {
  name: 'Luis QA',
  email: 'luis.qa@example.com',
  phone: '3001234567',
  address: 'Calle 123 #45-67',
};

test.describe('QAX Shop - Mission 1', () => {
  test('debe buscar un producto, agregarlo al carrito y completar la compra', async ({ page }) => {
    await test.step('Abrir catalogo y limpiar carrito', async () => {
      // Se abre el catálogo y se limpia localStorage para iniciar siempre con carrito vacío.
      await page.goto('./index.html');
      await page.evaluate(() => localStorage.clear());
      await page.reload();
      await expect(page).toHaveURL(/index\.html/);
    });

    await test.step('Validar catalogo con 12 productos', async () => {
      // Criterio de aceptación: el catálogo debe mostrar exactamente 12 productos.
      await expect(page.locator('.product-card')).toHaveCount(12);
    });

    await test.step('Buscar producto por cafe', async () => {
      // Se usa el buscador del catálogo y se valida que aparezca el producto esperado.
      await page.getByPlaceholder(/buscar productos/i).fill(productSearch);
      await expect(page.getByText(productName)).toBeVisible();
    });

    await test.step('Agregar producto al carrito', async () => {
      // Se agrega el producto filtrado y se verifica que el badge del carrito suba a 1.
      await page.getByRole('button', { name: /agregar al carrito/i }).click();
      await expect(page.locator('#cartBadge')).toHaveText('1');
    });

    await test.step('Validar producto agregado en carrito', async () => {
      // Se entra al carrito para confirmar que el producto agregado conserva nombre y precio.
      await page.locator('.cart-link').click();
      await expect(page.getByText(productName)).toBeVisible();
      await expect(page.getByText(productPrice).first()).toBeVisible();
    });

    await test.step('Navegar al checkout', async () => {
      // El botón real del carrito se llama "Ir a Pagar" y debería llevar al checkout.
      await page.getByRole('link', { name: /ir a pagar/i }).click();
      await expect(page).toHaveURL(/checkout\.html/);
    });

    await test.step('Validar formulario de checkout', async () => {
      // Criterio de aceptación: el checkout debe solicitar nombre, email, teléfono y dirección.
      await expect(page.getByPlaceholder(/nombre/i)).toBeVisible();
      await expect(page.getByPlaceholder(/email/i)).toBeVisible();
      await expect(page.getByPlaceholder(/tel[eé]fono/i)).toBeVisible();
      await expect(page.getByPlaceholder(/direcci[oó]n/i)).toBeVisible();
    });

    await test.step('Completar formulario con datos validos', async () => {
      // Se diligencian datos válidos para simular una compra real.
      await page.getByPlaceholder(/nombre/i).fill(checkoutData.name);
      await page.getByPlaceholder(/email/i).fill(checkoutData.email);
      await page.getByPlaceholder(/tel[eé]fono/i).fill(checkoutData.phone);
      await page.getByPlaceholder(/direcci[oó]n/i).fill(checkoutData.address);
    });

    await test.step('Confirmar compra y validar numero de orden', async () => {
      // Al confirmar la compra, la aplicación debe mostrar una orden con formato QAX-ORDER-XXXXX.
      await page.getByRole('button', { name: /confirmar|comprar|finalizar/i }).click();
      await expect(page.getByText(/QAX-ORDER-\d{5}/)).toBeVisible();
    });
  });
});
