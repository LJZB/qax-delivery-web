import { test, expect } from "@playwright/test";

test("debe iniciar sesión en QAX Clinic y mostrar el formulario de reserva", async ({ page }) => {
  await test.step("Abrir la página de login de QAX Clinic", async () => {
    await page.goto("https://qaxpert.com/lab/sites/stage-1/clinic/index.html");
  });

  await test.step("Verificar el título de la página", async () => {
    await expect(page).toHaveTitle("QAX Clinic — Ingreso Pacientes");
  });

  //Verificar que el campo documento solo acepte números
  await test.step("Verificar que el campo documento solo acepte números", async () => {
    const documentInput = page.getByPlaceholder("Ej. 1234567890");
    await documentInput.fill("abc123xyz");
    await expect(documentInput).toHaveValue("123");
  });

  //Ingresar documento y contraseña válidos
  await test.step("Ingresar documento y contraseña válidos", async () => {
    await page.getByPlaceholder("Ej. 1234567890").fill("1234567890");
    await page.getByPlaceholder("Ingrese su contraseña").fill("paciente123");
  });

  // Hacer clic en el botón Ingresar
  await test.step("Hacer clic en el botón Ingresar", async () => {
    await page.getByRole("button", { name: "Ingresar" }).click();
  });

  await test.step("Verificar redirección a la página de reserva de cita", async () => {
    await expect(page).toHaveURL(/appointment\.html$/);
  });

  await test.step('Verificar encabezado "Reservar Cita"', async () => {
    await expect(page.getByRole("heading", { name: "Reservar Cita Médica" })).toBeVisible();
  });

  await test.step("Verificar campo centro médico", async () => {
    await expect(page.getByLabel("Centro Médico")).toBeVisible();
  });

  await test.step("Verificar campo fecha", async () => {
    await expect(page.getByText("Fecha de Visita")).toBeVisible();
  });

  await test.step("Verificar campo programa", async () => {
    await expect(page.getByText("Programa de Salud")).toBeVisible();
  });

  await test.step("Verificar campo comentarios", async () => {
    await expect(page.getByText("Comentarios Adicionales")).toBeVisible();
  });
});
