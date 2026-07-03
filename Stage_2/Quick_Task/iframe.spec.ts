import { test, expect } from "@playwright/test";

test.describe("Iframe", () => {
  test("debe escribir texto dentro de un iframe", async ({ page }) => {
    // Navegamos a la página que contiene el iframe.
    await page.goto("https://demo.automationtesting.in/Frames.html");

    // Validamos que la pestaña del iframe simple está visible.
    await expect(page.getByText("Single Iframe")).toBeVisible();

    // Entramos al iframe usando su selector CSS.
    // Aquí usamos locator CSS porque el iframe no tiene un rol accesible útil para ubicarlo.
    const frame = page.frameLocator("#singleframe");

    // Buscamos el input dentro del iframe usando su rol accesible.
    const input = frame.getByRole("textbox");

    // Escribimos texto dentro del input del iframe.
    await input.fill("QAX iframe test");

    // Validamos que el texto realmente quedó escrito.
    await expect(input).toHaveValue("QAX iframe test");
  });
});
