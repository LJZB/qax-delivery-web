import { Page } from "@playwright/test";

/**
 * Clase padre de todos los Page Objects del proyecto.
 *
 * Conserva la instancia de `Page` como `protected` para que las clases hijas
 * puedan interactuar con el navegador sin exponerla directamente al test.
 */
export class BasePage {
  constructor(protected readonly page: Page) {}

  /**
   * Abre una ruta de Haguazon usando el `baseURL` configurado en Playwright.
   * Recibe rutas relativas como `index.html` para conservar el path `/haguazon/`.
   */
  async navigate(path: string): Promise<void> {
    await this.page.goto(path);
  }
}
