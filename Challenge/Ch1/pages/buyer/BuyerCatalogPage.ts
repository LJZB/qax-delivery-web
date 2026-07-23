import { expect, type Locator, type Page } from '@playwright/test';

export class BuyerCatalogPage {
  readonly heading: Locator;
  readonly searchInput: Locator;
  readonly cartLink: Locator;

  constructor(private readonly page: Page) {
    // Controles principales del catálogo para buscar productos y revisar el badge del carrito.
    this.heading = page.getByRole('heading', { name: /Catalogo de Productos|Cat.logo de Productos/ });
    this.searchInput = page.getByRole('textbox', { name: 'Buscar productos...' });
    this.cartLink = page.getByRole('link', { name: /Carrito/ });
  }

  async expectLoaded() {
    // El catálogo debe mostrarse después de seleccionar el rol comprador.
    await expect(this.heading).toBeVisible();
  }

  async expectProductVisible(productName: string) {
    // La visibilidad del producto confirma que el catálogo renderiza o filtra correctamente.
    await expect(this.page.getByText(productName)).toBeVisible();
  }

  async search(productName: string) {
    // La búsqueda se envía con Enter, igual que en el flujo capturado con Codegen.
    await this.searchInput.fill(productName);
    await this.searchInput.press('Enter');
  }

  async openProduct(productName: string) {
    // Abrir por nombre valida la navegación desde catálogo hacia detalle.
    await this.page.getByText(productName).click();
  }

  async openCart() {
    // La navegación al carrito se reutiliza después de agregar productos desde el detalle.
    await this.cartLink.click();
  }

  async expectCartCount(quantity: number) {
    // El badge del carrito prueba que el producto fue agregado correctamente.
    await expect(this.cartLink).toContainText(`(${quantity})`);
  }
}
