import { expect, type Page } from '@playwright/test';

export class OrdersPage {
  constructor(private readonly page: Page) {}

  async expectLoaded() {
    // Successful checkout redirects the buyer to the orders history.
    await expect(this.page.getByRole('heading', { name: /Mis .rdenes/ })).toBeVisible();
  }

  async expectLatestOrderForCustomer(customerName: string, address: string, productName: string) {
    // The newest generated order is validated as a full card to avoid fragile split-text assertions.
    const latestOrder = this.page.locator('main > div > div').filter({ hasText: customerName }).last();

    await expect(latestOrder).toBeVisible();
    await expect(latestOrder).toContainText('Confirmado');
    await expect(latestOrder).toContainText('$ 1.500.000');
    await expect(latestOrder).toContainText('Pago:');
    await expect(latestOrder).toContainText(address);
    await latestOrder.getByText(/Ver detalle/).click();
    await expect(latestOrder).toContainText(`${productName} x1`);
  }
}
