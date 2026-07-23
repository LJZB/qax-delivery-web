import { expect, type Locator, type Page } from '@playwright/test';

export class BuyerCatalogPage {
  readonly heading: Locator;
  readonly searchInput: Locator;
  readonly cartLink: Locator;

  constructor(private readonly page: Page) {
    // Main catalog controls used by the buyer to search products and review the cart badge.
    this.heading = page.getByRole('heading', { name: /Catalogo de Productos|Cat.logo de Productos/ });
    this.searchInput = page.getByRole('textbox', { name: 'Buscar productos...' });
    this.cartLink = page.getByRole('link', { name: /Carrito/ });
  }

  async expectLoaded() {
    // Catalog page must be visible after selecting the buyer role.
    await expect(this.heading).toBeVisible();
  }

  async expectProductVisible(productName: string) {
    // Product visibility confirms that catalog data is rendered or filtered correctly.
    await expect(this.page.getByText(productName)).toBeVisible();
  }

  async search(productName: string) {
    // Search is submitted with Enter, matching the flow captured with Codegen.
    await this.searchInput.fill(productName);
    await this.searchInput.press('Enter');
  }

  async openProduct(productName: string) {
    // Opening by product name validates the buyer can navigate from catalog to detail.
    await this.page.getByText(productName).click();
  }

  async openCart() {
    // Cart navigation is reused after adding products from the detail page.
    await this.cartLink.click();
  }

  async expectCartCount(quantity: number) {
    // The cart badge is the acceptance criterion that proves the cart was updated.
    await expect(this.cartLink).toContainText(`(${quantity})`);
  }
}
