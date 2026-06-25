// Importamos las herramientas principales de Playwright.
// test permite definir pruebas y grupos de pruebas.
// expect permite hacer validaciones.
import { test, expect } from "@playwright/test";

// Agrupamos las pruebas relacionadas con el dashboard de QAX Bank.
test.describe("Feature: Dashboard de QAX Bank", () => {
  // beforeEach se ejecuta antes de cada test dentro de este describe.
  // Aquí hacemos login para que cada validación empiece desde el dashboard.
  test.beforeEach(async ({ page }) => {
    // Abrimos la página de login de QAX Bank.
    await page.goto("https://qaxpert.com/lab/sites/stage-1/bank/index.html");
    await page.locator("#email").fill("cliente@qaxbank.com");
    await page.locator("#password").fill("Test1234");
    await page.getByRole("button", { name: "Ingresar" }).click();
    await expect(page).toHaveURL(/dashboard\.html/);
  });

  // Creamos un solo test para validar todas las cuentas esperadas del dashboard.
  test("Validar cuentas del dashboard", async ({ page }) => {
    // Creamos un array de objetos.
    // Cada objeto representa una cuenta que esperamos ver en el dashboard.
    const cuentasEsperadas = [
      {
        cuenta: "Cuenta de Ahorros",
        saldo: "$ 1.845.000 COP",
      },
      {
        cuenta: "Cuenta Corriente",
        saldo: "$ 1.845.000 COP",
      },
    ];

    // Recorremos el array con un ciclo for...of.
    // En cada vuelta, cuentaEsperada toma el valor de una cuenta del array.
    for (const cuentaEsperada of cuentasEsperadas) {
      // Validamos que el nombre de la cuenta actual sea visible.
      await expect(page.getByText(cuentaEsperada.cuenta)).toBeVisible();

      // Validamos que el saldo correspondiente a esa cuenta sea visible.
      await expect(page.getByText(cuentaEsperada.saldo)).toBeVisible();
    }
  });
});
