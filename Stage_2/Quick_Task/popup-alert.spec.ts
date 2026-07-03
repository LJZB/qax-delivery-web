import { test, expect } from "@playwright/test";

test.describe("Popup / Alert", () => {
  test("debe aceptar un alert", async ({ page }) => {
    // Navegamos a la página donde están los dialog boxes.
    await page.goto("https://bonigarcia.dev/selenium-webdriver-java/dialog-boxes.html");

    // Escuchamos el alert antes del click porque aparece inmediatamente.
    page.once("dialog", async (dialog) => {
      // Validamos que el mensaje del alert sea el esperado.
      expect(dialog.message()).toBe("Hello world!");

      // Aceptamos el alert para cerrarlo.
      await dialog.accept();
    });

    // Disparamos el alert usando getByRole porque es un botón accesible.
    await page.getByRole("button", { name: "Launch alert" }).click();
  });

  test("debe aceptar un confirm", async ({ page }) => {
    // Navegamos a la página de dialog boxes.
    await page.goto("https://bonigarcia.dev/selenium-webdriver-java/dialog-boxes.html");

    // Escuchamos el confirm antes del click.
    page.once("dialog", async (dialog) => {
      // Validamos el texto del confirm.
      expect(dialog.message()).toBe("Is this correct?");

      // Aceptamos el confirm, por eso el resultado será true.
      await dialog.accept();
    });

    // Lanzamos el confirm.
    await page.getByRole("button", { name: "Launch confirm" }).click();

    // Validamos el texto visible que deja la página después de aceptar.
    await expect(page.getByText("You chose: true")).toBeVisible();
  });

  test("debe escribir texto en un prompt", async ({ page }) => {
    // Navegamos a la página de dialog boxes.
    await page.goto("https://bonigarcia.dev/selenium-webdriver-java/dialog-boxes.html");

    // Escuchamos el prompt antes del click.
    page.once("dialog", async (dialog) => {
      // Validamos el mensaje del prompt.
      expect(dialog.message()).toBe("Please enter your name");

      // Aceptamos el prompt enviando texto.
      await dialog.accept("Luis QA");
    });

    // Lanzamos el prompt.
    await page.getByRole("button", { name: "Launch prompt" }).click();

    // Validamos que la página muestre el texto ingresado.
    await expect(page.getByText("You typed: Luis QA")).toBeVisible();
  });

  test("debe manejar un modal", async ({ page }) => {
    // Navegamos a la página de dialog boxes.
    await page.goto("https://bonigarcia.dev/selenium-webdriver-java/dialog-boxes.html");

    // Abrimos el modal.
    await page.getByRole("button", { name: "Launch modal" }).click();

    // Validamos que el título y cuerpo del modal estén visibles.
    await expect(page.getByText("Modal title")).toBeVisible();
    await expect(page.getByText("This is the modal body")).toBeVisible();

    // Cerramos el modal guardando cambios.
    await page.getByRole("button", { name: "Save changes" }).click();

    // Validamos el mensaje que deja la página después de cerrar el modal.
    await expect(page.getByText("You chose: Save changes")).toBeVisible();
  });
});
