import { expect, type Locator, type Page } from '@playwright/test';

export class SellerProductsPage {
  readonly heading: Locator;
  readonly publishProductLink: Locator;
  readonly receivedOrdersLink: Locator;
  readonly switchToBuyerLink: Locator;

  constructor(private readonly page: Page) {
    // Seller product table and navigation actions available after choosing the seller role.
    this.heading = page.getByRole('heading', { name: 'Mis Productos' });
    this.publishProductLink = page.getByRole('link', { name: '+ Publicar Nuevo Producto' });
    this.receivedOrdersLink = page.getByRole('link', { name: /.rdenes Recibidas/ });
    this.switchToBuyerLink = page.getByRole('link', { name: 'Cambiar a Comprador' });
  }

  async expectLoaded() {
    // The seller landing page must expose the product table and publishing action.
    await expect(this.heading).toBeVisible();
    await expect(this.publishProductLink).toBeVisible();
    await expect(this.receivedOrdersLink).toBeVisible();
  }

  async openPublishProductForm() {
    // Publishing a new product starts from the products table page.
    await this.publishProductLink.click();
  }

  async expectProductInTable(productName: string) {
    // The created product must be rendered in the seller product table after saving.
    await expect(this.page.getByRole('cell', { name: productName })).toBeVisible();
  }

  async switchToBuyerCatalog() {
    // This supports test setup when the seller needs a fresh actionable order.
    await this.switchToBuyerLink.click();
  }

  async openReceivedOrders() {
    // Received orders validates the seller can manage purchases for the store.
    await this.receivedOrdersLink.click();
  }
}
