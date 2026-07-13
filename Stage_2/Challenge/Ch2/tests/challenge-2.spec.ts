import { expect, test } from '@playwright/test';

const formsUrl = 'https://qaxpert.com/lab/sites/stage-2/forms/index.html';
const evidencePauseMs = 1000;

async function pauseForEvidence(page: import('@playwright/test').Page) {
  await page.waitForTimeout(evidencePauseMs);
}

async function openAlertsTab(page: import('@playwright/test').Page) {
  await page.goto(formsUrl);

  // getByRole respeta la prioridad de localizadores: "2. Alertas y Modales" es un tab/boton visible.
  await page.getByRole('button', { name: '2. Alertas y Modales' }).click();
  await expect(page.getByRole('heading', { name: 'Alertas del Navegador (Alert / Confirm / Prompt)' })).toBeVisible();
}

async function openFramesTab(page: import('@playwright/test').Page) {
  await page.goto(formsUrl);

  // "3. Frames" es un boton visible de la navegacion por tabs, por eso se prioriza getByRole.
  await page.getByRole('button', { name: '3. Frames' }).click();
  await expect(page.getByRole('heading', { name: /iFrame Simple/ })).toBeVisible();
}

test.describe('Challenge 2: Comportamientos avanzados - Cobertura total', () => {
  test('HU-01: Cobertura total de alertas nativas', async ({ page }) => {
    await test.step('Given que el QA esta en la seccion Alertas y Modales', async () => {
      await openAlertsTab(page);
    });

    // Criterio 1: la alerta simple se muestra y se cierra al aceptar.
    await test.step('When acepta una alerta simple Then se muestra el resultado de aceptacion', async () => {
      page.once('dialog', async (dialog) => {
        expect(dialog.type()).toBe('alert');
        expect(dialog.message()).toBe('Esta es una alerta simple del navegador.');
        await dialog.accept();
      });

      await page.getByRole('button', { name: 'Alerta Simple' }).click();
      await pauseForEvidence(page);

      await expect(page.locator('#alertResult')).toHaveText('Alerta simple aceptada.');
      await expect(page.locator('#alertResult')).toHaveClass(/success/);
    });

    // Criterio 2: confirmar aceptando muestra "You pressed Ok".
    await test.step('When acepta un dialogo confirm Then muestra mensaje de OK', async () => {
      page.once('dialog', async (dialog) => {
        expect(dialog.type()).toBe('confirm');
        expect(dialog.message()).toBe('¿Estás seguro de continuar con esta operación?');
        await dialog.accept();
      });

      await page.getByRole('button', { name: 'Confirmar (Aceptar OK)' }).click();
      await pauseForEvidence(page);

      await expect(page.locator('#alertResult')).toHaveText('You pressed Ok');
      await expect(page.locator('#alertResult')).toHaveClass(/success/);
    });

    // Criterio 3: confirmar cancelando muestra "You Pressed Cancel".
    await test.step('When cancela un dialogo confirm Then muestra mensaje de cancelacion', async () => {
      page.once('dialog', async (dialog) => {
        expect(dialog.type()).toBe('confirm');
        expect(dialog.message()).toBe('¿Deseás cancelar esta operación?');
        await dialog.dismiss();
      });

      await page.getByRole('button', { name: 'Confirmar (Cancelar)' }).click();
      await pauseForEvidence(page);

      await expect(page.locator('#alertResult')).toHaveText('You Pressed Cancel');
      await expect(page.locator('#alertResult')).toHaveClass(/warn/);
    });

    // Criterio 4: prompt con texto muestra el mensaje incluyendo lo ingresado.
    await test.step('When ingresa texto en el prompt Then el resultado incluye ese texto', async () => {
      page.once('dialog', async (dialog) => {
        expect(dialog.type()).toBe('prompt');
        expect(dialog.message()).toBe('Ingresá tu nombre:');
        await dialog.accept('Luis QA');
      });

      await page.getByRole('button', { name: 'Prompt (Ingresar Texto)' }).click();
      await pauseForEvidence(page);

      await expect(page.locator('#alertResult')).toHaveText('Hello Luis QA How are you today');
      await expect(page.locator('#alertResult')).toHaveClass(/info/);
    });

    // Criterio 5: prompt cancelado no ingresa texto y el resultado queda como null/no mostrado.
    await test.step('When cancela el prompt Then no se ingresa texto y no se muestra resultado', async () => {
      await openAlertsTab(page);

      page.once('dialog', async (dialog) => {
        expect(dialog.type()).toBe('prompt');
        expect(dialog.message()).toBe('Ingresá tu nombre:');
        await dialog.dismiss();
      });

      await page.getByRole('button', { name: 'Prompt (Ingresar Texto)' }).click();
      await pauseForEvidence(page);

      await expect(page.locator('#alertResult')).toBeHidden();
      await expect(page.locator('#alertResult')).toBeEmpty();
    });
  });

  test('HU-02: Validar estados de modales personalizados', async ({ page }) => {
    await test.step('Given que el QA esta en la seccion Alertas y Modales', async () => {
      await openAlertsTab(page);
    });

    // Criterios 1 y 2: el modal se abre y muestra titulo/cuerpo esperados.
    await test.step('When abre el modal de confirmacion Then el contenido esperado es visible', async () => {
      await page.getByRole('button', { name: 'Abrir Modal de Confirmación' }).click();
      await pauseForEvidence(page);

      // #confirmModal se usa porque el overlay no tiene role="dialog".
      const confirmModal = page.locator('#confirmModal');

      await expect(confirmModal).toBeVisible();
      await expect(confirmModal.getByRole('heading', { name: '¿Confirmar acción?' })).toBeVisible();
      await expect(confirmModal.getByText('Estás a punto de realizar una operación importante. ¿Deseás continuar?')).toBeVisible();
    });

    // Criterio 3: Cancelar cierra el modal y no ejecuta la accion.
    await test.step('When hace clic en Cancelar Then el modal cierra sin ejecutar la accion', async () => {
      const confirmModal = page.locator('#confirmModal');

      await confirmModal.getByRole('button', { name: 'Cancelar' }).click();
      await pauseForEvidence(page);

      await expect(confirmModal).toBeHidden();
      await expect(page.locator('#alertResult')).toBeHidden();
      await expect(page.locator('#alertResult')).toBeEmpty();
    });

    // Criterio 4: Confirmar cierra el modal y ejecuta la accion esperada.
    await test.step('When hace clic en Confirmar Then el modal cierra y ejecuta la accion', async () => {
      await page.getByRole('button', { name: 'Abrir Modal de Confirmación' }).click();

      const confirmModal = page.locator('#confirmModal');
      await expect(confirmModal).toBeVisible();

      await confirmModal.getByRole('button', { name: 'Confirmar' }).click();
      await pauseForEvidence(page);

      await expect(confirmModal).toBeHidden();
      await expect(page.locator('#alertResult')).toHaveText('Operación confirmada exitosamente.');
      await expect(page.locator('#alertResult')).toHaveClass(/success/);
    });

    // Criterio 5: despues de cerrarse, el modal informativo tampoco queda visible en pantalla.
    await test.step('When abre y cierra el modal informativo Then no queda visible en pantalla', async () => {
      await page.getByRole('button', { name: 'Abrir Modal Informativo' }).click();
      await pauseForEvidence(page);

      // #infoModal identifica el segundo modal personalizado de la pagina.
      const infoModal = page.locator('#infoModal');

      await expect(infoModal).toBeVisible();
      await expect(infoModal.getByRole('heading', { name: 'Información' })).toBeVisible();
      await expect(infoModal.getByText(/Este es un modal informativo/)).toBeVisible();

      await infoModal.getByRole('button', { name: 'Cerrar' }).click();
      await pauseForEvidence(page);

      await expect(infoModal).toBeHidden();
    });
  });

  test('HU-03: Validar interaccion con iframes simples y anidados', async ({ page }) => {
    await test.step('Given que el QA esta en la seccion Frames', async () => {
      await openFramesTab(page);
    });

    // Criterio 1: el iframe simple debe ser visible y su contenido debe ser accesible.
    await test.step('When inspecciona el iframe simple Then su contenido es visible y accesible', async () => {
      // #singleIframe identifica el iframe; luego getByRole se usa dentro del contexto del frame.
      const termsFrame = page.frameLocator('#singleIframe');

      await expect(page.locator('#singleIframe')).toBeVisible();
      await expect(termsFrame.getByRole('heading', { name: 'Términos y Condiciones de QAXpert' })).toBeVisible();
      await expect(termsFrame.getByText('Última actualización:')).toBeVisible();
      await expect(termsFrame.getByText('legal@qaxpert.co')).toBeVisible();
      await pauseForEvidence(page);
    });

    // Criterio 2: se puede navegar al iframe hijo y escribir en su input.
    await test.step('When carga el iframe hijo Then puede escribir en su input', async () => {
      const parentFrame = page.frameLocator('#parentIframe');

      await expect(parentFrame.getByRole('heading', { name: 'iFrame Padre — QAXpert Forms' })).toBeVisible();
      const loadChildFrameType = await parentFrame.getByRole('button', { name: 'Cargar Iframe Hijo' }).evaluate((button) => {
        return typeof button.ownerDocument.defaultView?.loadChildFrame;
      });

      expect(loadChildFrameType).toBe('function');
      // El boton existe por rol, pero su accion vive en un onclick dentro del iframe padre.
      await parentFrame.getByRole('button', { name: 'Cargar Iframe Hijo' }).click();
      await expect(parentFrame.locator('#childContainer')).toHaveClass(/active/);
      await expect(parentFrame.locator('#btnLoadChild')).toHaveText(/Iframe Hijo Cargado/);

      const childFrame = parentFrame.locator('#childFrame').contentFrame();
      await expect(childFrame.getByRole('heading', { name: 'iFrame Hijo — Campo de Texto' })).toBeVisible();
      await childFrame.getByPlaceholder('Escribí texto aquí...').fill('Texto desde Playwright');
      await pauseForEvidence(page);
    });

    // Criterio 4: el mensaje generado dentro del iframe hijo debe ser correcto.
    await test.step('Then el mensaje generado dentro del iframe hijo es correcto', async () => {
      const childFrame = page.frameLocator('#parentIframe').locator('#childFrame').contentFrame();

      await expect(childFrame.locator('#childResult')).toHaveText('Texto ingresado: Texto desde Playwright');
    });

    // Criterio 3: despues de trabajar con iframes, Playwright vuelve al contexto principal sin errores.
    await test.step('And despues del iframe vuelve al contexto principal sin errores', async () => {
      await page.getByRole('button', { name: 'Inicio' }).click();
      await pauseForEvidence(page);

      await expect(page.getByRole('heading', { name: 'Bienvenido al Sandbox de QAXpert Forms' })).toBeVisible();
      await expect(page.getByRole('button', { name: /Iniciar Registro/ })).toBeVisible();
    });
  });

  test('HU-04: Validar flujo combinado con cambios de contexto', async ({ page }) => {
    await test.step('Given que el QA inicia en la seccion Alertas y Modales', async () => {
      await openAlertsTab(page);
    });

    // Criterio 1: abrir una alerta, luego un modal, luego un iframe en secuencia.
    await test.step('When abre una alerta nativa Then vuelve al contexto principal', async () => {
      page.once('dialog', async (dialog) => {
        expect(dialog.type()).toBe('alert');
        expect(dialog.message()).toBe('Esta es una alerta simple del navegador.');
        await dialog.accept();
      });

      await page.getByRole('button', { name: 'Alerta Simple' }).click();
      await pauseForEvidence(page);

      // #alertResult no tiene rol semantico propio; se valida como estado visual de la pagina.
      await expect(page.locator('#alertResult')).toHaveText('Alerta simple aceptada.');
      await expect(page.getByRole('heading', { name: 'Alertas del Navegador (Alert / Confirm / Prompt)' })).toBeVisible();
      await expect(page.getByRole('button', { name: /Abrir Modal de Confirmaci/ })).toBeVisible();
    });

    // Criterio 2: despues del modal se conserva el contexto principal y el overlay se cierra.
    await test.step('And abre y confirma un modal Then el contexto principal sigue disponible', async () => {
      await page.getByRole('button', { name: /Abrir Modal de Confirmaci/ }).click();

      // #confirmModal se usa porque el modal personalizado no declara role="dialog".
      const confirmModal = page.locator('#confirmModal');
      await expect(confirmModal).toBeVisible();
      await expect(confirmModal.getByRole('heading', { name: /Confirmar acci/ })).toBeVisible();

      await confirmModal.getByRole('button', { name: 'Confirmar' }).click();
      await pauseForEvidence(page);

      await expect(confirmModal).toBeHidden();
      await expect(page.locator('#alertResult')).toHaveText(/confirmada exitosamente/);
      await expect(page.getByRole('button', { name: 'Alerta Simple' })).toBeVisible();
    });

    // Criterio 3: al entrar y salir del iframe simple, la pagina no pierde su estado navegable.
    await test.step('And navega a un iframe Then puede volver al contexto principal sin errores', async () => {
      await page.getByRole('button', { name: '3. Frames' }).click();
      await expect(page.getByRole('heading', { name: /iFrame Simple/ })).toBeVisible();

      const termsFrame = page.frameLocator('#singleIframe');
      await expect(page.locator('#singleIframe')).toBeVisible();
      await expect(termsFrame.getByRole('heading', { name: /Condiciones de QAXpert/ })).toBeVisible();
      await expect(termsFrame.getByText('legal@qaxpert.co')).toBeVisible();
      await pauseForEvidence(page);

      await page.getByRole('button', { name: 'Inicio' }).click();
      await expect(page.getByRole('heading', { name: 'Bienvenido al Sandbox de QAXpert Forms' })).toBeVisible();
      await expect(page.getByRole('button', { name: /Iniciar Registro/ })).toBeVisible();
    });

    // Criterio 4: despues de alternar contextos, las validaciones finales siguen pasando.
    await test.step('Then el estado de la pagina no se corrompe al alternar contextos', async () => {
      await page.getByRole('button', { name: '2. Alertas y Modales' }).click();

      await expect(page.getByRole('heading', { name: 'Alertas del Navegador (Alert / Confirm / Prompt)' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Alerta Simple' })).toBeVisible();
      await expect(page.getByRole('button', { name: /Abrir Modal de Confirmaci/ })).toBeVisible();
      await expect(page.locator('#confirmModal')).toBeHidden();
      await expect(page.locator('#infoModal')).toBeHidden();
    });
  });
});
