import { expect, type Locator, type Page } from '@playwright/test';

export class ProductDetailPage {
  readonly addToCartButton: Locator;
  readonly makeOfferButton: Locator;
  readonly quantityInput: Locator;

  constructor(private readonly page: Page) {
    // Detail page actions available for the selected product.
    this.addToCartButton = page.getByRole('button', { name: 'Agregar al Carrito' });
    this.makeOfferButton = page.getByRole('button', { name: 'Hacer Oferta' });
    this.quantityInput = page.getByRole('spinbutton', { name: 'Cantidad:' });
  }

  async expectLoaded(productName: string) {
    // Product detail must expose id-based navigation and the key purchase metadata.
    await expect(this.page).toHaveURL(/buyer-product\.html\?id=/);
    await expect(this.page.getByRole('heading', { name: productName })).toBeVisible();
    await expect(this.addToCartButton).toBeVisible();
    await expect(this.makeOfferButton).toBeVisible();
    await expect(this.quantityInput).toBeVisible();
    await expect(this.page.getByText('Stock:')).toBeVisible();
    await expect(this.page.getByText('Vendedor:')).toBeVisible();
  }

  async addToCart() {
    // Add once to keep the expected cart badge deterministic.
    await this.addToCartButton.click();
    await expect(this.page.getByText('Producto agregado al carrito')).toBeVisible();
  }
}

