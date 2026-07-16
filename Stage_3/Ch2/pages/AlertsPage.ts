import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/** Encapsula la creacion y administracion de alertas de precio. */
export class AlertsPage extends BasePage {
  readonly assetSelect: Locator;
  readonly conditionSelect: Locator;
  readonly targetPriceInput: Locator;
  readonly createButton: Locator;
  readonly alertItems: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    super(page);
    this.assetSelect = page.locator("#alertAsset");
    this.conditionSelect = page.locator("#alertCondition");
    this.targetPriceInput = page.locator("#alertTarget");
    this.createButton = page.getByRole("button", { name: /crear alerta/i });
    this.alertItems = page.locator("#alertList .alert-item");
    this.emptyState = page.locator("#emptyAlerts");
  }

  /** Completa los tres campos obligatorios y crea la alerta. */
  async createAlert(
    asset: string,
    condition: "above" | "below",
    targetPrice: string,
  ): Promise<void> {
    await this.assetSelect.selectOption(asset);
    await this.conditionSelect.selectOption(condition);
    await this.targetPriceInput.fill(targetPrice);
    await this.createButton.click();
  }

  /** Cambia el estado de la primera alerta mediante su control ON/OFF. */
  async toggleFirstAlert(): Promise<void> {
    await this.alertItems.first().locator(".toggle-btn").click();
  }

  /** Elimina la primera alerta persistida y visible. */
  async deleteFirstAlert(): Promise<void> {
    await this.alertItems.first().getByRole("button", { name: /eliminar/i }).click();
  }

  /** Comprueba contenido, estado activo y control ON de la alerta creada. */
  async verifyCreatedAlert(
    asset: string,
    conditionText: string,
    targetPrice: string,
  ): Promise<void> {
    await expect(this.alertItems).toHaveCount(1);
    const alert = this.alertItems.first();
    await expect(alert).toContainText(asset);
    await expect(alert).toContainText(conditionText);
    await expect(alert).toContainText(`$${targetPrice}`);
    await expect(alert.locator(".toggle-btn")).toHaveText("ON");
    await expect(alert.locator(".toggle-btn")).toHaveClass(/on/);
  }

  /**
   * Valida tanto la clase de negocio `inactive` como su efecto visual real:
   * opacidad reducida a 0.5 y boton cambiado a OFF.
   */
  async verifyAlertIsInactive(): Promise<void> {
    const alert = this.alertItems.first();
    await expect(alert).toHaveClass(/inactive/);
    await expect(alert).toHaveCSS("opacity", "0.5");
    await expect(alert.locator(".toggle-btn")).toHaveText("OFF");
    await expect(alert.locator(".toggle-btn")).toHaveClass(/off/);
  }

  /** Confirma que la alerta desaparecio y se recupero el estado vacio. */
  async verifyAlertWasDeleted(): Promise<void> {
    await expect(this.alertItems).toHaveCount(0);
    await expect(this.emptyState).toBeVisible();
    await expect(this.emptyState).toContainText("No tienes alertas configuradas");
  }
}
