import { expect, type Locator, type Page } from '@playwright/test';

type ProductData = {
  name: string;
  description: string;
  category: string;
  price: string;
  stock: string;
  imagePath: string;
};

export class PublishProductPage {
  readonly heading: Locator;
  readonly productNameInput: Locator;
  readonly descriptionInput: Locator;
  readonly categorySelect: Locator;
  readonly priceInput: Locator;
  readonly stockInput: Locator;
  readonly imageInput: Locator;
  readonly publishButton: Locator;

  constructor(private readonly page: Page) {
    // Product publishing form fields captured from the seller Codegen flow.
    this.heading = page.getByRole('heading', { name: 'Publicar Nuevo Producto' });
    this.productNameInput = page.getByRole('textbox', { name: 'Nombre del Producto' });
    this.descriptionInput = page.getByRole('textbox', { name: /Descripci.n/ });
    this.categorySelect = page.getByLabel(/Categor.a/);
    this.priceInput = page.getByRole('spinbutton', { name: 'Precio (COP)' });
    this.stockInput = page.getByRole('spinbutton', { name: 'Stock Disponible' });
    this.imageInput = page.locator('#prodImage');
    this.publishButton = page.getByRole('button', { name: 'Publicar Producto' });
  }

  async expectLoaded() {
    // The form must allow entering all required product publication data.
    await expect(this.heading).toBeVisible();
    await expect(this.productNameInput).toBeVisible();
    await expect(this.descriptionInput).toBeVisible();
    await expect(this.categorySelect).toBeVisible();
    await expect(this.priceInput).toBeVisible();
    await expect(this.stockInput).toBeVisible();
    await expect(this.publishButton).toBeVisible();
  }

  async publishProduct(product: ProductData) {
    // Fill the complete form, including the simulated image upload used by the SUT.
    await this.productNameInput.fill(product.name);
    await this.descriptionInput.fill(product.description);
    await this.categorySelect.selectOption(product.category);
    await this.priceInput.fill(product.price);
    await this.stockInput.fill(product.stock);
    await this.imageInput.setInputFiles(product.imagePath);
    await this.publishButton.click();
  }
}
