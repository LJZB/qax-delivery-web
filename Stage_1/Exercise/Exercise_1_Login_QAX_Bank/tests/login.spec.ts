import { test, expect } from "@playwright/test";

test("debe cargar correctamente la página de login de QAX Bank", async ({ page }) => {
  await test.step("Abrir la página de login de QAX Bank", async () => {
    await page.goto("https://qaxpert.com/lab/sites/stage-1/bank/index.html");
  });

  await test.step("Verificar el título de la página", async () => {
    await expect(page).toHaveTitle("QAX Bank — Banca Digital");
  });

  await test.step("Localizar campo de correo y llenar información", async () => {
    await page.locator("#email").fill("cliente@qaxbank.com");
  });

  await test.step("Localizar campo de contraseña y llenar información", async () => {
    await page.locator("#password").fill("Test1234");
  });

  await test.step("Hacer clic en el botón de ingresar", async () => {
    await page.getByRole("button", { name: "Ingresar" }).click();
  });

  await test.step("Verificar que se redirija al usuario al dashboard", async () => {
    await expect(page).toHaveURL(/dashboard\.html$/);
  });

  await test.step("Verificar que se muestre el mensaje de bienvenida", async () => {
    await expect(page.getByText("Hola, Carlos Andrés López")).toBeVisible();
  });
});
