import { Page } from "@playwright/test";

/** Clase base para las acciones compartidas por los Page Objects. */
export class BasePage {
  constructor(protected readonly page: Page) {}

  /** Navega a una ruta relativa de QAXTrade. */
  async navigate(path: string): Promise<void> {
    await this.page.goto(path);
  }
}

