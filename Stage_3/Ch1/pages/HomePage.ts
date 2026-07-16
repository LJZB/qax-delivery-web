import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Representa la pagina principal de Haguazon.
 *
 * Su responsabilidad dentro del challenge es preparar el escenario mediante
 * la interfaz: agrega un producto real y abre la pagina completa del carrito.
 */
export class HomePage extends BasePage {
  /*
   * Localizadores de la pagina principal y del carrito flotante.
   * `productCards` permite trabajar con cualquier producto sin depender de un
   * nombre fijo. El enlace se busca dentro del carrito para limitar su alcance.
   */
  readonly productCards: Locator;
  readonly floatingCart: Locator;
  readonly goToCartLink: Locator;

  constructor(page: Page) {
    super(page);
    this.productCards = page.locator(".product-card");
    this.floatingCart = page.locator("#floatingCart");
    this.goToCartLink = this.floatingCart.getByRole("link", {
      name: /ir al carrito/i,
    });
  }

  /**
   * Agrega el primer producto visible usando el boton de su propia tarjeta.
   * El `first()` mantiene deterministico el escenario y evita inyectar el
   * producto directamente en localStorage.
   */
  async addFirstProductToCart(): Promise<void> {
    await this.productCards
      .first()
      .getByRole("button", { name: /agregar al carrito/i })
      .click();
  }

  /** Navega desde el carrito flotante hacia la pagina `cart.html`. */
  async goToCart(): Promise<void> {
    await this.goToCartLink.click();
  }

  /**
   * Comprueba las dos señales visuales de que el producto fue agregado:
   * el panel recibe la clase `open` y su enlace principal queda visible.
   */
  async verifyFloatingCartIsOpen(): Promise<void> {
    await expect(this.floatingCart).toHaveClass(/open/);
    await expect(this.goToCartLink).toBeVisible();
  }
}
