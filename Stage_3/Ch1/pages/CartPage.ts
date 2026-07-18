import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Encapsula el comportamiento de la pagina dedicada del carrito.
 * Centraliza los detalles del producto, el control de cantidad, los subtotales
 * y la transicion al checkout.
 */
export class CartPage extends BasePage {
  /*
   * Localizadores del producto y del resumen del carrito.
   * Los campos del producto se buscan dentro del primer `.cart-item` para no
   * confundirlos con importes similares presentes en el resumen lateral.
   */
  readonly cartItems: Locator;
  readonly firstItemName: Locator;
  readonly firstItemPrice: Locator;
  readonly firstItemQuantity: Locator;
  readonly firstItemSubtotal: Locator;
  readonly summarySubtotal: Locator;
  readonly checkoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator(".cart-item");
    const firstItem = this.cartItems.first();
    this.firstItemName = firstItem.locator(".item-title");
    this.firstItemPrice = firstItem.locator(".item-price");
    this.firstItemQuantity = firstItem.locator(".qty-control input");
    this.firstItemSubtotal = firstItem.locator(".item-subtotal .st");
    this.summarySubtotal = page
      .locator(".cart-summary .row")
      .first()
      .locator("span")
      .last();
    this.checkoutLink = page.getByRole("link", {
      name: /proceder al pago/i,
    });
  }

  /**
   * Sustituye la cantidad del primer producto y presiona Tab.
   *
   * Haguazon recalcula el carrito mediante el evento DOM `change`; mover el
   * foco con Tab dispara ese evento igual que lo haria un usuario real.
   */
  async changeFirstProductQuantity(quantity: number): Promise<void> {
    await this.firstItemQuantity.fill(quantity.toString());
    await this.firstItemQuantity.press("Tab");
  }

  /** Inicia el checkout utilizando el enlace visible del resumen. */
  async proceedToCheckout(): Promise<void> {
    await this.checkoutLink.click();
  }

  /**
   * Devuelve el subtotal mostrado, sin espacios externos, para conservar una
   * referencia anterior al cambio de cantidad.
   */
  async getSummarySubtotal(): Promise<string> {
    return (await this.summarySubtotal.innerText()).trim();
  }

  /**
   * Valida que exista exactamente un producto y que sus tres datos requeridos
   * sean coherentes: nombre no vacio, precio COP visible y cantidad inicial 1.
   */
  async verifyFirstProductDetails(): Promise<void> {
    await expect(this.cartItems).toHaveCount(1);
    await expect(this.firstItemName).not.toHaveText("");
    await expect(this.firstItemPrice).toHaveText(/^\$[\d.]+$/);
    await expect(this.firstItemQuantity).toHaveValue("1");
  }

  /**
   * Confirma que la nueva cantidad se guardo, que el subtotal cambio y que el
   * subtotal del producto coincide con el subtotal del resumen. Al existir un
   * solo producto, ambos importes deben ser iguales.
   */
  async verifyQuantityAndSubtotal(
    quantity: number,
    previousSubtotal: string,
  ): Promise<void> {
    await expect(this.firstItemQuantity).toHaveValue(quantity.toString());
    await expect(this.summarySubtotal).not.toHaveText(previousSubtotal);
    await expect(this.firstItemSubtotal).toHaveText(
      await this.summarySubtotal.innerText(),
    );
  }
}
