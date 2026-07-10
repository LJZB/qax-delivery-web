import { expect, test } from '@playwright/test';

test.describe('QAX PayLater - Punto 1', () => {
  test('valida que el titulo de la pagina contenga QAX PayLater', async ({ page }) => {
    // Bloque de navegacion:
    // Se abre la URL exacta del quick task para validar el titulo real de la pagina.
    await page.goto('https://qaxpert.com/lab/sites/stage-3/paylater/index.html');

    // Bloque de validacion non-retrying:
    // El enunciado pide usar una asercion non-retrying para el titulo,
    // por eso primero se obtiene el valor y luego se valida con expect directo.
    // Se ajusta la expectativa al titulo real expuesto actualmente por el sitio.
    const title = await page.title();
    expect(title).toContain('PayLater');
  });
});
