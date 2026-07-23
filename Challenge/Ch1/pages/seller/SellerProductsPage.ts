import { expect, type Locator, type Page } from '@playwright/test';

export class SellerProductsPage {
  readonly heading: Locator;
  readonly publishProductLink: Locator;
  readonly receivedOrdersLink: Locator;
  readonly switchToBuyerLink: Locator;

  constructor(private readonly page: Page) {
    // Tabla de productos del vendedor y acciones de navegación disponibles desde ese rol.
    this.heading = page.getByRole('heading', { name: 'Mis Productos' });
    this.publishProductLink = page.getByRole('link', { name: '+ Publicar Nuevo Producto' });
    this.receivedOrdersLink = page.getByRole('link', { name: /.rdenes Recibidas/ });
    this.switchToBuyerLink = page.getByRole('link', { name: 'Cambiar a Comprador' });
  }

  async expectLoaded() {
    // La página del vendedor debe mostrar la tabla y la acción para publicar productos.
    await expect(this.heading).toBeVisible();
    await expect(this.publishProductLink).toBeVisible();
    await expect(this.receivedOrdersLink).toBeVisible();
  }

  async openPublishProductForm() {
    // La publicación de un producto inicia desde la tabla de productos del vendedor.
    await this.publishProductLink.click();
  }

  async expectProductInTable(productName: string) {
    // El producto creado debe aparecer en la tabla después de guardar el formulario.
    await expect(this.page.getByRole('cell', { name: productName })).toBeVisible();
  }

  async switchToBuyerCatalog() {
    // Permite preparar una compra fresca cuando el vendedor necesita una orden accionable.
    await this.switchToBuyerLink.click();
  }

  async openReceivedOrders() {
    // Las órdenes recibidas permiten validar la gestión de pedidos del vendedor.
    await this.receivedOrdersLink.click();
  }
}
