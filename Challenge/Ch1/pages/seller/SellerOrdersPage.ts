import { expect, type Locator, type Page } from '@playwright/test';

export class SellerOrdersPage {
  readonly heading: Locator;
  readonly markAsSentButton: Locator;

  constructor(private readonly page: Page) {
    // Orders table and status-changing action available to the seller.
    this.heading = page.getByRole('heading', { name: /.rdenes Recibidas/ });
    this.markAsSentButton = page.getByRole('button', { name: 'Marcar como Enviado' }).first();
  }

  async goto() {
    // Direct navigation keeps setup short after creating a buyer order for the seller.
    await this.page.goto('seller-orders.html');
  }

  async expectLoaded() {
    // Table headers prove the received orders management page is rendered.
    await expect(this.heading).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'ID' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Comprador' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Producto(s)' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Total' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Estado' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Fecha' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: /Acci.n/ })).toBeVisible();
  }

  async expectOrdersWithStatus() {
    // At least one visible status confirms that received orders include state information.
    await expect(this.page.getByText(/Confirmado|Enviado|Entregado/).first()).toBeVisible();
  }

  async expectOrderForProduct(productName: string) {
    // The seller must see the order generated for the product published during this scenario.
    await expect(this.page.getByRole('cell', { name: `${productName} x1` })).toBeVisible();
  }

  async markFirstPendingOrderAsSent() {
    // The seller can move a confirmed order to the sent state from the orders table.
    await expect(this.markAsSentButton).toBeVisible();
    this.page.once('dialog', (dialog) => dialog.dismiss().catch(() => {}));
    await this.markAsSentButton.click();
  }

  async expectSentStatusVisible() {
    // The state change is complete when the table shows an Enviado status.
    await expect(this.page.getByText('Enviado').first()).toBeVisible();
  }
}
