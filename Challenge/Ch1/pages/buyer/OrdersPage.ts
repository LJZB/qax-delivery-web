import { expect, type Page } from '@playwright/test';

export class OrdersPage {
  constructor(private readonly page: Page) {}

  async expectLoaded() {
    // Un checkout exitoso redirige al comprador al historial de órdenes.
    await expect(this.page.getByRole('heading', { name: /Mis .rdenes/ })).toBeVisible();
  }

  async expectLatestOrderForCustomer(customerName: string, address: string, productName: string) {
    // La orden generada se valida como tarjeta completa para evitar assertions frágiles por texto dividido.
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
