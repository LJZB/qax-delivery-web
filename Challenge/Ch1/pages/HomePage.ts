import { expect, type Locator, type Page } from '@playwright/test';

export class HomePage {
  readonly buyerRole: Locator;
  readonly sellerRole: Locator;

  constructor(private readonly page: Page) {
    // Tarjetas de rol disponibles en la página inicial del marketplace.
    this.buyerRole = page.getByRole('heading', { name: 'Soy Comprador' });
    this.sellerRole = page.getByRole('heading', { name: 'Soy Vendedor' });
  }

  async goto() {
    // Navega usando baseURL para controlar ambientes QA/PROD desde playwright.config.ts.
    await this.page.goto('index.html');
  }

  async expectLoaded() {
    // La página inicial está lista cuando ambos roles de usuario son visibles.
    await expect(this.buyerRole).toBeVisible();
    await expect(this.sellerRole).toBeVisible();
  }

  async selectBuyerRole() {
    // El rol comprador inicia el flujo de catálogo y compra.
    await this.buyerRole.click();
  }

  async selectSellerRole() {
    // El rol vendedor inicia el flujo de productos y órdenes.
    await this.sellerRole.click();
  }
}
