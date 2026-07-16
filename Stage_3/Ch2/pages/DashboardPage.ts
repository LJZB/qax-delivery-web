import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Modela el dashboard principal: resumen, watchlist y grafico de velas.
 * Las verificaciones visuales se concentran aqui para que el test describa
 * reglas de negocio sin conocer selectores o valores CSS.
 */
export class DashboardPage extends BasePage {
  /* Localizadores del resumen y los componentes actualizados en tiempo real. */
  readonly portfolioValue: Locator;
  readonly dailyPnL: Locator;
  readonly availableCash: Locator;
  readonly watchlistRows: Locator;
  readonly positiveChanges: Locator;
  readonly negativeChanges: Locator;
  readonly candles: Locator;

  constructor(page: Page) {
    super(page);
    this.portfolioValue = page.locator("#portValue");
    this.dailyPnL = page.locator("#dailyPnL");
    this.availableCash = page.locator("#cashBal");
    this.watchlistRows = page.locator("#watchlistBody tr");
    this.positiveChanges = page.locator("#watchlistBody .change.up");
    this.negativeChanges = page.locator("#watchlistBody .change.down");
    this.candles = page.locator("#candleChart .candle");
  }

  /** Devuelve el precio visible de un activo de la watchlist. */
  async getAssetPrice(symbol: string): Promise<string> {
    const row = this.watchlistRows.filter({ hasText: symbol }).first();
    return (await row.locator(".price").innerText()).trim();
  }

  /** Valida los tres valores solicitados en el resumen del portafolio. */
  async verifyPortfolioSummary(): Promise<void> {
    await expect(this.portfolioValue).toHaveText(/^\$[\d,]+\.\d{2}$/);
    await expect(this.dailyPnL).toHaveText(/^[+-]?\$\d+\.\d{2}$/);
    await expect(this.availableCash).toHaveText("$25,000.00");
  }

  /**
   * Comprueba las diez filas y la informacion minima de cada activo: simbolo,
   * precio monetario y cambio porcentual.
   */
  async verifyWatchlistAssets(): Promise<void> {
    await expect(this.watchlistRows).toHaveCount(10);

    for (const row of await this.watchlistRows.all()) {
      await expect(row.locator("td").nth(0)).not.toHaveText("");
      await expect(row.locator(".price")).toHaveText(/^\$[\d,.]+$/);
      await expect(row.locator(".change")).toHaveText(/\([+-]?\d+\.\d{2}%\)$/);
    }
  }

  /**
   * Espera una muestra con movimientos de ambos signos y valida los colores
   * definidos por QAXTrade: verde para positivos y rojo para negativos.
   */
  async verifyChangeColors(): Promise<void> {
    await expect.poll(() => this.positiveChanges.count()).toBeGreaterThan(0);
    await expect.poll(() => this.negativeChanges.count()).toBeGreaterThan(0);

    for (const change of await this.positiveChanges.all()) {
      await expect(change).toHaveCSS("color", "rgb(63, 185, 80)");
    }
    for (const change of await this.negativeChanges.all()) {
      await expect(change).toHaveCSS("color", "rgb(248, 81, 73)");
    }
  }

  /** Valida que el mini-chart renderice exactamente veinte velas con cuerpo. */
  async verifyCandlestickChart(): Promise<void> {
    await expect(this.candles).toHaveCount(20);
    for (const candle of await this.candles.all()) {
      await expect(candle.locator(".body")).toBeVisible();
    }
  }

  /**
   * Espera el siguiente ciclo de actualizacion sin usar una pausa fija.
   * La consulta finaliza tan pronto como el precio difiere de la muestra inicial.
   */
  async verifyPriceUpdates(symbol: string, initialPrice: string): Promise<void> {
    await expect
      .poll(() => this.getAssetPrice(symbol), {
        timeout: 7_000,
        intervals: [500],
      })
      .not.toBe(initialPrice);
  }
}
