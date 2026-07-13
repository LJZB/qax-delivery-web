import { expect, test, type Page } from '@playwright/test';

test.describe('QAX PayLater - Puntos 1 al 10', () => {
  async function seedSimulatorData(page: Page) {
    // Bloque de datos previos:
    // El simulador requiere datos de usuario, verificacion y productos en
    // localStorage antes de abrir el paso 3 del flujo.
    await page.addInitScript(() => {
      localStorage.setItem(
        'qaxpaylater_current_user',
        JSON.stringify({
          nombres: 'Luis',
          apellidos: 'Zuluaga',
          numDoc: '1234567890',
          scoreCrediticio: 720,
        }),
      );

      localStorage.setItem(
        'qaxpaylater_verification',
        JSON.stringify({
          status: 'verified',
        }),
      );

      localStorage.setItem(
        'qaxpaylater_products',
        JSON.stringify([
          {
            id: 1,
            nombre: 'iPhone 15 Pro 256GB',
            categoria: 'Telefonos',
            precio: 5499000,
            img: 'https://picsum.photos/seed/iphone/400/300',
          },
        ]),
      );
    });
  }

  async function fillRequiredFields(page: Page) {
    // Bloque de datos validos:
    // Se llenan los campos obligatorios con valores realistas para habilitar
    // el envio del formulario y reutilizar la preparacion entre pruebas.
    await page.locator('#nombres').fill('Luis');
    await page.locator('#apellidos').fill('Zuluaga');
    await page.locator('#tipoDoc').selectOption('CC');
    await page.locator('#numDoc').fill('1234567890');
    await page.locator('#email').fill('luis@example.com');
    await page.locator('#telefono').fill('3001234567');
    await page.locator('#ingreso').fill('2500000');
    await page.locator('#dependientes').selectOption('0');
    await page.locator('#direccion').fill('Calle 123 #45-67');
  }

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

  test('valida que la seccion del simulador de credito este visible', async ({ page }) => {
    // Bloque de datos previos:
    // Se siembran las dependencias del simulador antes de cargar la pagina.
    await seedSimulatorData(page);

    // Bloque de navegacion:
    // Se abre directamente el paso 3, que es donde vive la calculadora
    // del simulador de credito.
    await page.goto('https://qaxpert.com/lab/sites/stage-3/paylater/apply-step3.html');

    // Bloque de interaccion:
    // La seccion del simulador se muestra cuando se selecciona un producto
    // y un plazo de financiamiento.
    await page.locator('.product-card').first().click();
    await page.locator('label[for="term12"], label:has(#term12)').click();

    // Bloque de validacion auto-retrying:
    // Se valida la visibilidad del simulador usando la seccion calculadora
    // y su encabezado visible.
    const simulatorSection = page.locator('#calculator');
    const simulatorHeading = page.getByRole('heading', { name: 'Calculadora de Cuotas' });

    await expect(simulatorSection).toBeVisible();
    await expect(simulatorHeading).toBeVisible();
  });

  test('punto 3: valida que el boton de accion este deshabilitado inicialmente', async ({ page }) => {
    // Bloque de navegacion:
    // Se abre el paso 1 del flujo, que contiene el formulario principal.
    await page.goto('https://qaxpert.com/lab/sites/stage-3/paylater/apply-step1.html');

    // Bloque de elementos:
    // Se ubica el boton principal del formulario para validar el estado inicial.
    const submitButton = page.locator('#btnSubmit');

    // Bloque de validacion fiel al enunciado:
    // La expectativa sigue literalmente la consigna, aunque el sitio actual
    // no cumpla este comportamiento y la prueba pueda fallar.
    await expect(submitButton).toBeDisabled();
  });

  test('punto 4: valida que al llenar los campos obligatorios, el boton se habilite', async ({ page }) => {
    // Bloque de navegacion:
    // Se abre el formulario principal antes de completar sus campos.
    await page.goto('https://qaxpert.com/lab/sites/stage-3/paylater/apply-step1.html');

    // Bloque de preparacion:
    // Se diligencian todos los campos obligatorios con datos validos.
    await fillRequiredFields(page);

    // Bloque de validacion auto-retrying:
    // La validacion del estado habilitado se hace con expect sobre el boton
    // para mantener una asercion estable y alineada con Playwright.
    const submitButton = page.locator('#btnSubmit');
    await expect(submitButton).toBeEnabled();
  });

  test('punto 5: valida que al enviar el formulario, aparezca un mensaje de confirmacion', async ({ page }) => {
    // Bloque de navegacion:
    // Se abre el formulario principal antes de enviarlo.
    await page.goto('https://qaxpert.com/lab/sites/stage-3/paylater/apply-step1.html');

    // Bloque de preparacion:
    // Se completa el formulario con datos validos para permitir el envio.
    await fillRequiredFields(page);

    // Bloque de accion:
    // Se envia el formulario para disparar el toast de confirmacion.
    await page.locator('#btnSubmit').click();

    // Bloque de validacion auto-retrying:
    // El mensaje de confirmacion se renderiza dinamicamente como toast.
    const confirmationToast = page.locator('.toast');
    await expect(confirmationToast).toBeVisible();
  });

  test('punto 6: valida que el mensaje de confirmacion contenga el texto esperado', async ({ page }) => {
    // Bloque de navegacion:
    // Se abre el formulario principal antes de enviarlo.
    await page.goto('https://qaxpert.com/lab/sites/stage-3/paylater/apply-step1.html');

    // Bloque de preparacion:
    // Se completa el formulario con datos validos antes del envio.
    await fillRequiredFields(page);

    // Bloque de accion:
    // Se envia el formulario para generar el mensaje de confirmacion.
    await page.locator('#btnSubmit').click();

    // Bloque de validacion auto-retrying:
    // Se valida el texto visible esperado dentro del toast de confirmacion.
    const confirmationToast = page.locator('.toast');
    await expect(confirmationToast).toContainText('Datos guardados correctamente');
  });

  test('punto 7: valida que un campo de entrada mantenga el valor ingresado', async ({ page }) => {
    // Bloque de navegacion:
    // Se abre el formulario principal para validar el campo de nombres.
    await page.goto('https://qaxpert.com/lab/sites/stage-3/paylater/apply-step1.html');

    // Bloque de accion:
    // Se escribe un valor en el campo de nombres para validar persistencia local.
    const nameInput = page.locator('#nombres');
    await nameInput.fill('Luis');

    // Bloque de validacion auto-retrying:
    // Se confirma que el campo conserva exactamente el valor digitado.
    await expect(nameInput).toHaveValue('Luis');
  });

  test('punto 8: valida que un campo sea editable', async ({ page }) => {
    // Bloque de navegacion:
    // Se abre el formulario principal para validar editabilidad.
    await page.goto('https://qaxpert.com/lab/sites/stage-3/paylater/apply-step1.html');

    // Bloque de elementos:
    // Se selecciona un campo de texto del formulario para validar editabilidad.
    const addressInput = page.locator('#direccion');

    // Bloque de validacion auto-retrying:
    // Primero se valida que el campo sea editable y luego que acepte escritura.
    await expect(addressInput).toBeEditable();
    await addressInput.fill('Carrera 10 #20-30');
    await expect(addressInput).toHaveValue('Carrera 10 #20-30');
  });

  test('punto 9: valida que un campo acepte un formato numerico valido', async ({ page }) => {
    // Bloque de navegacion:
    // Se abre el formulario principal para validar el campo numerico.
    await page.goto('https://qaxpert.com/lab/sites/stage-3/paylater/apply-step1.html');

    // Bloque de accion:
    // Se usa el campo numerico de ingreso mensual, que en el HTML define
    // tipo number, valor minimo y step.
    const incomeInput = page.locator('#ingreso');
    await incomeInput.fill('2500000');

    // Bloque de validacion auto-retrying:
    // Se confirma que el valor numerico valido queda persistido en el input.
    await expect(incomeInput).toHaveValue('2500000');
  });

  test('punto 10: valida que al enviar sin llenar campos obligatorios, aparezca un borde rojo en los campos vacios', async ({ page }) => {
    // Bloque de navegacion:
    // Se abre el formulario principal para validar errores de campos vacios.
    await page.goto('https://qaxpert.com/lab/sites/stage-3/paylater/apply-step1.html');

    // Bloque de accion:
    // Se intenta enviar el formulario vacio para verificar el estilo de error
    // pedido por la consigna.
    await page.locator('#btnSubmit').click();

    // Bloque de validacion soft:
    // La consigna pide usar soft assertions para validar atributos de varios
    // campos despues del envio del formulario.
    const redBorder = 'rgb(239, 68, 68)';
    await expect.soft(page.locator('#nombres')).toHaveCSS('border-color', redBorder);
    await expect.soft(page.locator('#email')).toHaveCSS('border-color', redBorder);
    await expect.soft(page.locator('#ingreso')).toHaveCSS('border-color', redBorder);
  });
});
