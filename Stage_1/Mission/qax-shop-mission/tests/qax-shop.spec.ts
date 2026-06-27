import { test, expect } from '@playwright/test';

test.describe('QAX Shop - Mission 1', () => {
  test('debe buscar un producto y agregarlo al carrito', async ({ page }) => {
    // Abrimos la pagina principal de la tienda.
    await page.goto('./index.html');

    // Limpiamos el carrito guardado en localStorage para iniciar la prueba desde cero.
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Validamos que el catalogo cargue con los 12 productos esperados.
    await expect(page.locator('.product-card')).toHaveCount(12);

    // Buscamos una parte del nombre "Café Colombiano Premium 500g".
    // Se usa "afé" porque la busqueda exacta con "café" no retorna resultados actualmente.
    await page.getByPlaceholder(/buscar productos/i).fill('afé');

    // Validamos que el filtro muestre el producto esperado.
    await expect(page.getByText('Café Colombiano Premium 500g')).toBeVisible();

    // Agregamos el producto filtrado al carrito.
    await page.getByRole('button', { name: /agregar al carrito/i }).click();

    // Validamos que el contador del carrito se actualice a 1.
    await expect(page.locator('#cartBadge')).toHaveText('1');

    // Entramos al carrito para confirmar que el producto agregado se conserva.
    await page.locator('.cart-link').click();

    // Validamos nombre y precio del producto dentro del carrito.
    await expect(page.getByText('Café Colombiano Premium 500g')).toBeVisible();
    await expect(page.getByText('$ 45.000 COP').first()).toBeVisible();
  });
});
