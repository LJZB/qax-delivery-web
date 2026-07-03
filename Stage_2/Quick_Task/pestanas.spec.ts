import { test, expect } from "@playwright/test";

test.describe("Manejo de pestañas", () => {
  test("debe abrir una nueva pestaña al hacer click en Open New Tabbed Windows", async ({ page }) => {
    // Navegamos a la página de manejo de ventanas/pestañas.
    await page.goto("https://demo.automationtesting.in/Windows.html");

    // Validamos que estamos en la sección correcta antes de interactuar.
    await expect(page.getByText("Open New Tabbed Windows")).toBeVisible();

    // Esperamos la nueva pestaña antes de hacer click.
    // Esto evita que Playwright pierda el evento si la pestaña abre muy rápido.
    const [newPage] = await Promise.all([
      page.context().waitForEvent("page"),

      // Usamos getByRole porque el botón/link es accesible por su rol y texto visible.
      page.getByRole("link", { name: "click" }).click(),
    ]);

    // Esperamos que la nueva pestaña cargue el DOM.
    await newPage.waitForLoadState("domcontentloaded");

    // Validamos que la nueva pestaña abrió la web esperada.
    await expect(newPage).toHaveURL(/selenium\.dev/);

    // Validamos que el título corresponde al sitio de Selenium.
    await expect(newPage).toHaveTitle(/Selenium/);

    // Cerramos la pestaña nueva para dejar limpio el contexto del test.
    await newPage.close();
  });
});
