import { expect, type Locator, type Page } from '@playwright/test';

export class SellerOrdersPage {
  readonly heading: Locator;
  readonly markAsSentButton: Locator;

  constructor(private readonly page: Page) {
    // Tabla de órdenes y acción que permite cambiar el estado del pedido.
    this.heading = page.getByRole('heading', { name: /.rdenes Recibidas/ });
    this.markAsSentButton = page.getByRole('button', { name: 'Marcar como Enviado' }).first();
  }

  async goto() {
    // Navegación directa para volver a órdenes después de crear una compra como preparación.
    await this.page.goto('seller-orders.html');
  }

  async expectLoaded() {
    // Los encabezados prueban que la página de gestión de órdenes recibidas está renderizada.
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
    // Al menos un estado visible confirma que las órdenes incluyen información de seguimiento.
    await expect(this.page.getByText(/Confirmado|Enviado|Entregado/).first()).toBeVisible();
  }

  async expectOrderForProduct(productName: string) {
    // El vendedor debe ver la orden generada para el producto publicado en este escenario.
    await expect(this.page.getByRole('cell', { name: `${productName} x1` })).toBeVisible();
  }

  async markFirstPendingOrderAsSent() {
    // El vendedor puede mover una orden confirmada al estado enviado desde la tabla.
    await expect(this.markAsSentButton).toBeVisible();
    this.page.once('dialog', (dialog) => dialog.dismiss().catch(() => {}));
    await this.markAsSentButton.click();
  }

  async expectSentStatusVisible() {
    // El cambio queda validado cuando la tabla muestra el estado Enviado.
    await expect(this.page.getByText('Enviado').first()).toBeVisible();
  }
}
