import { expect, type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly checkoutLink: Locator;
  readonly quantityInput: Locator;

  constructor(private readonly page: Page) {
    // Cart controls used to validate line items and continue to checkout.
    this.checkoutLink = page.getByRole('link', { name: 'Ir a Pagar' });
    this.quantityInput = page.getByRole('spinbutton');
  }

  async expectLoaded() {
    // Table headers prove the cart summary is rendered before payment starts.
    await expect(this.page.getByRole('columnheader', { name: 'Producto' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Precio' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Cantidad' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Subtotal' })).toBeVisible();
    await expect(this.checkoutLink).toBeVisible();
  }

  async updateQuantity(quantity: number) {
    // Quantity is normalized to one item so the final order total is predictable.
    await this.quantityInput.fill(String(quantity));
  }

  async goToCheckout() {
    // Checkout starts the two-step shipping and payment form.
    await this.checkoutLink.click();
  }
}
