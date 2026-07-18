import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/** Modela la tabla de holdings, P&L, grafico pie y estado vacio. */
export class PortfolioPage extends BasePage {
  readonly holdingsTable: Locator;
  readonly holdingRows: Locator;
  readonly positivePnL: Locator;
  readonly negativePnL: Locator;
  readonly pieChart: Locator;
  readonly pieLegendItems: Locator;
  readonly emptyState: Locator;
  readonly cashSummary: Locator;

  constructor(page: Page) {
    super(page);
    this.holdingsTable = page.locator("#holdingsWrap");
    this.holdingRows = page.locator("#holdingsBody tr");
    this.positivePnL = page.locator("#holdingsBody .pnl.up");
    this.negativePnL = page.locator("#holdingsBody .pnl.down");
    this.pieChart = page.locator("#pieChart");
    this.pieLegendItems = page.locator("#pieLegend .legend-item");
    this.emptyState = page.locator("#emptyState");
    this.cashSummary = page
      .locator("#summaryRow .summary-card")
      .filter({ hasText: "Efectivo" })
      .locator(".val");
  }

  /**
   * Comprueba las columnas de negocio de cada holding. Los precios se validan
   * por formato para no acoplar la prueba al movimiento aleatorio del mercado.
   */
  async verifyHoldingDetails(expectedCount: number): Promise<void> {
    await expect(this.holdingRows).toHaveCount(expectedCount);

    for (const row of await this.holdingRows.all()) {
      await expect(row.locator("td").nth(0)).not.toHaveText("");
      await expect(row.locator("td").nth(1)).toHaveText(/^\d+(\.\d+)?$/);
      await expect(row.locator("td").nth(2)).toHaveText(/^\$[\d,]+\.\d{2}$/);
      await expect(row.locator("td").nth(4)).toHaveText(/^\$[\d,]+\.\d{2}$/);
    }
  }

  /** Valida simultaneamente una posicion ganadora verde y una perdedora roja. */
  async verifyProfitAndLossColors(): Promise<void> {
    await expect(this.positivePnL).toHaveCount(1);
    await expect(this.negativePnL).toHaveCount(1);
    await expect(this.positivePnL).toHaveCSS("color", "rgb(63, 185, 80)");
    await expect(this.negativePnL).toHaveCSS("color", "rgb(248, 81, 73)");
  }

  /** Comprueba que un activo comprado aparezca como posicion en la tabla. */
  async verifyHoldingSymbol(symbol: string): Promise<void> {
    await expect(this.holdingRows.filter({ hasText: symbol })).toHaveCount(1);
  }

  /** Valida en la interfaz el efectivo restante despues de una orden. */
  async verifyAvailableCash(expectedCash: number): Promise<void> {
    const formattedCash = `$${expectedCash.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
    await expect(this.cashSummary).toHaveText(formattedCash);
  }

  /**
   * El grafico se construye con `conic-gradient`; la leyenda demuestra que el
   * gradiente contiene segmentos independientes y colores visibles.
   */
  async verifyPieChart(): Promise<void> {
    await expect(this.pieChart).toBeVisible();
    await expect(this.pieChart).toHaveCSS("background-image", /conic-gradient/);
    await expect(this.pieLegendItems).toHaveCount(2);

    for (const item of await this.pieLegendItems.all()) {
      await expect(item.locator(".legend-dot")).not.toHaveCSS(
        "background-color",
        "rgba(0, 0, 0, 0)",
      );
    }
  }

  /** Valida que tabla y grafico se oculten cuando no existen posiciones. */
  async verifyEmptyPortfolio(): Promise<void> {
    await expect(this.emptyState).toBeVisible();
    await expect(this.emptyState).toContainText("No tienes posiciones abiertas");
    await expect(this.holdingsTable).toBeHidden();
    await expect(this.pieChart).toBeHidden();
  }
}
