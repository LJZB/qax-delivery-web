import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/** Representa el formulario de ordenes y su modal de confirmacion. */
export class TradePage extends BasePage {
  /* Localizadores de campos comunes, condicionales y resultado de la orden. */
  readonly assetSelect: Locator;
  readonly orderTypeSelect: Locator;
  readonly sideSelect: Locator;
  readonly quantityInput: Locator;
  readonly currentPrice: Locator;
  readonly limitFields: Locator;
  readonly limitPriceInput: Locator;
  readonly stopFields: Locator;
  readonly submitButton: Locator;
  readonly confirmationModal: Locator;
  readonly orderId: Locator;

  constructor(page: Page) {
    super(page);
    this.assetSelect = page.locator("#asset");
    this.orderTypeSelect = page.locator("#orderType");
    this.sideSelect = page.locator("#side");
    this.quantityInput = page.locator("#amount");
    this.currentPrice = page.locator("#currentPrice");
    this.limitFields = page.locator("#limitFields");
    this.limitPriceInput = page.locator("#limitPrice");
    this.stopFields = page.locator("#stopFields");
    this.submitButton = page.locator("#btnSubmit");
    this.confirmationModal = page.locator("#confirmModal");
    this.orderId = page.locator("#modalOrderId");
  }

  /* Acciones del formulario de trading. */
  async selectAsset(symbol: string): Promise<void> {
    await this.assetSelect.selectOption(symbol);
  }

  async selectOrderType(type: "market" | "limit"): Promise<void> {
    await this.orderTypeSelect.selectOption(type);
  }

  async selectSide(side: "buy" | "sell"): Promise<void> {
    await this.sideSelect.selectOption(side);
  }

  async fillQuantity(quantity: string): Promise<void> {
    await this.quantityInput.fill(quantity);
  }

  async fillLimitPrice(price: string): Promise<void> {
    await this.limitPriceInput.fill(price);
  }

  async submitOrder(): Promise<void> {
    await this.submitButton.click();
  }

  /** Lee el efectivo persistido para compararlo antes y despues de la compra. */
  async getAvailableCash(): Promise<number> {
    return this.page.evaluate(() =>
      Number(localStorage.getItem("qaxtrade_cash") ?? "0"),
    );
  }

  /** Devuelve la posicion persistida de un simbolo, si existe. */
  async getHolding(symbol: string): Promise<{ symbol: string; qty: number } | undefined> {
    return this.page.evaluate((requestedSymbol) => {
      const portfolio = JSON.parse(
        localStorage.getItem("qaxtrade_portfolio") ?? "[]",
      ) as Array<{ symbol: string; qty: number }>;
      return portfolio.find((holding) => holding.symbol === requestedSymbol);
    }, symbol);
  }

  /* Verificaciones de visibilidad, estado y reglas de cada tipo de orden. */
  async verifySelectedAssetPrice(): Promise<void> {
    await expect(this.currentPrice).toHaveText(/^\$[\d,]+\.\d{2}$/);
  }

  async verifyMarketFields(): Promise<void> {
    await expect(this.quantityInput).toBeVisible();
    await expect(this.sideSelect).toBeVisible();
    await expect(this.limitFields).not.toHaveClass(/show/);
    await expect(this.limitFields).toBeHidden();
    await expect(this.stopFields).toBeHidden();
  }

  async verifyLimitFieldIsVisible(): Promise<void> {
    await expect(this.limitFields).toHaveClass(/show/);
    await expect(this.limitPriceInput).toBeVisible();
  }

  async verifySubmitDisabled(): Promise<void> {
    await expect(this.submitButton).toBeDisabled();
  }

  async verifySubmitEnabled(): Promise<void> {
    await expect(this.submitButton).toBeEnabled();
  }

  /** El sitio genera `ORD-` seguido de los trece digitos de `Date.now()`. */
  async verifyOrderConfirmation(): Promise<void> {
    await expect(this.confirmationModal).toHaveClass(/show/);
    await expect(this.confirmationModal).toBeVisible();
    await expect(this.orderId).toHaveText(/^ORD-\d{13}$/);
  }

  async verifyPurchaseResult(
    symbol: string,
    previousCash: number,
    expectedQuantity: number,
  ): Promise<void> {
    const currentCash = await this.getAvailableCash();
    const holding = await this.getHolding(symbol);

    expect(currentCash).toBeLessThan(previousCash);
    expect(holding).toBeDefined();
    expect(holding?.qty).toBe(expectedQuantity);
  }
}
