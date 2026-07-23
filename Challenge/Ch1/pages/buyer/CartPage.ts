import { expect, type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly checkoutLink: Locator;
  readonly quantityInput: Locator;

  constructor(private readonly page: Page) {
    // Controles del carrito usados para validar la línea de compra y continuar al checkout.
    this.checkoutLink = page.getByRole('link', { name: 'Ir a Pagar' });
    this.quantityInput = page.getByRole('spinbutton');
  }

  async expectLoaded() {
    // Los encabezados de la tabla prueban que el resumen del carrito está renderizado.
    await expect(this.page.getByRole('columnheader', { name: 'Producto' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Precio' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Cantidad' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Subtotal' })).toBeVisible();
    await expect(this.checkoutLink).toBeVisible();
  }

  async updateQuantity(quantity: number) {
    // Normaliza la cantidad a una unidad para que el total final sea predecible.
    await this.quantityInput.fill(String(quantity));
  }

  async goToCheckout() {
    // El checkout inicia el formulario de envío y pago en dos pasos.
    await this.checkoutLink.click();
  }
}
