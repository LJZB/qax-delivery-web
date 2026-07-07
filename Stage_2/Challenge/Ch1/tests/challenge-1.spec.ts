import { expect, test } from '@playwright/test';

// URL base del sitio de practica usado en el Challenge 1.
const betUrl = 'https://qaxpert.com/lab/sites/stage-2/bet/index.html';
const walletUrl = 'https://qaxpert.com/lab/sites/stage-2/bet/wallet.html';
const historyUrl = 'https://qaxpert.com/lab/sites/stage-2/bet/history.html';

// Controlamos el saldo inicial para que el escenario de sobregiro sea deterministico.
const initialBalance = 500000;

test.describe('Challenge 1: Extendiendo flujo de apuestas', () => {
  test('HU-01: Bloquear apuesta cuando el monto supera el saldo disponible', async ({ page }) => {
    // Given: preparar un ticket real desde la pagina de eventos.
    // Se usa la UI como lo hace el usuario: abrir eventos, seleccionar cuotas y pasar a Mi Ticket.
    await test.step('Given que el apostador tiene dos selecciones agregadas al ticket', async () => {
      await page.goto(betUrl);

      // localStorage permite dejar la prueba independiente de ejecuciones previas.
      // Tambien fija el saldo en COP 500.000 para poder superar ese limite de forma controlada.
      await page.evaluate((balance) => {
        localStorage.setItem('qaxbet_wallet', JSON.stringify({ balance, currency: 'COP' }));
        localStorage.setItem('qaxbet_bets', JSON.stringify([]));
        localStorage.setItem('qaxbet_history', JSON.stringify([]));
      }, initialBalance);
      await page.reload();

      // El heading confirma que la pagina de eventos cargo.
      // La cuenta de 8 cards cubre el criterio base del sitio de apuestas.
      await expect(page.getByRole('heading', { name: /Eventos en Vivo/ })).toBeVisible();
      await expect(page.locator('.event-card')).toHaveCount(8);

      // .event-card representa cada partido disponible.
      // [data-pick="local"] expresa mejor la intencion que tomar el primer boton generico.
      await page.locator('.event-card').nth(0).locator('[data-pick="local"]').click();
      await page.locator('.event-card').nth(1).locator('[data-pick="local"]').click();

      // El ticket lateral debe reflejar las dos selecciones y habilitar la navegacion a Mi Ticket.
      await expect(page.locator('#ticketSidebar .ticket-item')).toHaveCount(2);
      await expect(page.getByRole('button', { name: /Ir a Apostar/ })).toBeEnabled();
    });

    // And: navegar a la pagina donde se ingresan los montos de apuesta.
    await test.step('And se encuentra en la pagina Mi Ticket', async () => {
      await page.getByRole('button', { name: /Ir a Apostar/ }).click();

      // La URL y el heading verifican que estamos en ticket.html.
      // Los inputs .amount-input confirman que hay un campo por cada seleccion.
      await expect(page).toHaveURL(/ticket\.html/);
      await expect(page.getByRole('heading', { name: 'Mi Ticket de Apuesta' })).toBeVisible();
      await expect(page.getByRole('spinbutton')).toHaveCount(2);
    });

    // When: ingresar un total mayor al saldo disponible.
    // COP 500.000 + COP 1.000 = COP 501.000, que supera el saldo controlado.
    await test.step('When ingresa montos cuyo total supera el saldo disponible', async () => {
      const amountInputs = page.getByRole('spinbutton');

      await amountInputs.nth(0).fill(String(initialBalance));
      await amountInputs.nth(1).fill('1000');

      // Validamos que el total calculado por la aplicacion sea el esperado
      // y que el balance posterior quede en negativo.
      await expect(page.locator('#totalAmount')).toHaveText('COP 501.000');
      await expect(page.locator('#balanceAfter')).toContainText('-');
    });

    // Then: criterio 1 de la HU.
    // Si el monto supera el saldo, el usuario no debe poder confirmar la apuesta.
    await test.step('Then el boton Realizar Apuesta debe estar deshabilitado', async () => {
      await expect(page.getByRole('button', { name: 'Realizar Apuesta' })).toBeDisabled();
    });

    // And: criterio 2 de la HU.
    // La app usa --danger (#ff4757), que en navegador se resuelve como rgb(255, 71, 87).
    await test.step('And el balance despues de apuesta debe mostrarse como monto excedido', async () => {
      await expect(page.locator('#balanceAfter')).toHaveCSS('color', 'rgb(255, 71, 87)');
    });
  });

  test('HU-02: Recargar billetera con un monto predefinido', async ({ page }) => {
    // Given: abrir la billetera con un saldo controlado.
    // Igual que en HU-01, localStorage nos permite empezar desde un estado conocido.
    await test.step('Given que el apostador se encuentra en la pagina Billetera con saldo disponible', async () => {
      await page.goto(walletUrl);
      await page.evaluate((balance) => {
        localStorage.setItem('qaxbet_wallet', JSON.stringify({ balance, currency: 'COP' }));
      }, initialBalance);
      await page.reload();

      // El heading valida que estamos en wallet.html.
      // #balanceDisplay es el saldo visible que debe cambiar despues de la recarga.
      await expect(page.getByRole('heading', { name: 'Mi Billetera' })).toBeVisible();
      await expect(page.locator('#balanceDisplay')).toHaveText('COP 500.000');
    });

    // When: seleccionar un monto predefinido.
    // getByRole respeta la prioridad de localizadores porque el preset es un boton con nombre visible.
    await test.step('When selecciona un monto predefinido de recarga', async () => {
      const presetAmount = page.getByRole('button', { name: '$200.000' });

      await presetAmount.click();

      // Criterio 1: el monto seleccionado debe quedar marcado como activo.
      // Tambien validamos que el input tome el mismo valor del preset.
      await expect(presetAmount).toHaveClass(/active/);
      await expect(page.getByRole('spinbutton', { name: 'Monto a recargar (COP)' })).toHaveValue('200000');
    });

    // And: confirmar la recarga.
    await test.step('And hace clic en Agregar Fondos', async () => {
      await page.getByRole('button', { name: 'Agregar Fondos a mi Billetera' }).click();

      // Criterio 2: despues de agregar fondos, la UI muestra el nuevo saldo.
      await expect(page.locator('#successMsg')).toBeVisible();
      await expect(page.locator('#balanceDisplay')).toHaveText('COP 700.000');
    });

    // Then: validar la suma exacta del saldo anterior mas el monto agregado.
    await test.step('Then el saldo anterior mas el monto agregado coincide con el nuevo saldo mostrado', async () => {
      const wallet = await page.evaluate(() => JSON.parse(localStorage.getItem('qaxbet_wallet') || '{}'));

      // Criterio 3: COP 500.000 + COP 200.000 = COP 700.000.
      await expect(page.locator('#balanceDisplay')).toHaveText('COP 700.000');
      expect(wallet.balance).toBe(700000);
    });
  });

  test('HU-03: Cancelar una apuesta antes de confirmarla', async ({ page }) => {
    // Given: crear una apuesta pendiente desde el flujo real de eventos.
    // La historia valida la cancelacion antes de confirmar, por eso necesitamos abrir el modal.
    await test.step('Given que el apostador tiene una apuesta lista para confirmar', async () => {
      await page.goto(betUrl);
      await page.evaluate((balance) => {
        localStorage.setItem('qaxbet_wallet', JSON.stringify({ balance, currency: 'COP' }));
        localStorage.setItem('qaxbet_bets', JSON.stringify([]));
        localStorage.setItem('qaxbet_history', JSON.stringify([]));
      }, initialBalance);
      await page.reload();

      await expect(page.getByRole('heading', { name: /Eventos en Vivo/ })).toBeVisible();

      // CSS queda como ultima opcion razonable porque las tarjetas y cuotas no exponen nombres accesibles unicos.
      await page.locator('.event-card').first().locator('[data-pick="local"]').click();
      await expect(page.locator('#ticketSidebar .ticket-item')).toHaveCount(1);

      await page.getByRole('button', { name: /Ir a Apostar/ }).click();
      await expect(page.getByRole('heading', { name: 'Mi Ticket de Apuesta' })).toBeVisible();

      await page.getByRole('spinbutton').fill('50000');
      await expect(page.locator('#balanceAfter')).toHaveText('COP 450.000');
    });

    // When: abrir el modal de confirmacion y cancelar la apuesta.
    await test.step('When hace clic en Cancelar en el modal de confirmacion', async () => {
      await page.getByRole('button', { name: 'Realizar Apuesta' }).click();

      // #confirmModal identifica el modal porque hay dos botones "Cancelar" potenciales en otros flujos.
      const confirmModal = page.locator('#confirmModal');
      await expect(confirmModal).toHaveClass(/active/);
      await expect(confirmModal.getByRole('heading', { name: /Confirmar Apuesta/ })).toBeVisible();

      await confirmModal.getByRole('button', { name: 'Cancelar' }).click();
      await expect(confirmModal).not.toHaveClass(/active/);
    });

    // Then: criterio 1 de la HU.
    // Cancelar debe cerrar el modal sin registrar la apuesta en localStorage.
    await test.step('Then la apuesta no se registra', async () => {
      const history = await page.evaluate(() => JSON.parse(localStorage.getItem('qaxbet_history') || '[]'));

      expect(history).toHaveLength(0);
      await expect(page.locator('#successModal')).not.toHaveClass(/active/);
    });

    // And: criterio 2 de la HU.
    // Como no se confirmo la apuesta, el saldo debe permanecer igual al saldo inicial.
    await test.step('And el saldo permanece sin cambios despues de cancelar', async () => {
      const wallet = await page.evaluate(() => JSON.parse(localStorage.getItem('qaxbet_wallet') || '{}'));

      expect(wallet.balance).toBe(initialBalance);
      await expect(page.locator('#balanceAfter')).toHaveText('COP 450.000');
    });

    // And: criterio 3 de la HU.
    // El historial visible debe continuar vacio porque la apuesta fue cancelada.
    await test.step('And la apuesta cancelada no aparece en el historial', async () => {
      await page.goto(historyUrl);

      await expect(page.getByRole('heading', { name: 'Historial de Apuestas' })).toBeVisible();
      await expect(page.locator('#historyBody .empty')).toHaveText('No se encontraron apuestas');
      await expect(page.locator('#historyBody tr')).toHaveCount(1);
    });
  });

  test('HU-04: Filtrar y ordenar apuestas en el historial', async ({ page }) => {
    // Given: preparar un historial con estados, montos y equipos variados.
    // Esto permite validar filtros y ordenamiento sin depender de datos creados por otros escenarios.
    await test.step('Given que el apostador tiene apuestas registradas en el historial', async () => {
      await page.goto(historyUrl);
      await page.evaluate(() => {
        localStorage.setItem(
          'qaxbet_history',
          JSON.stringify([
            {
              id: 'bet-pendiente-alto',
              fecha: '2026-07-06T10:00:00.000Z',
              selecciones: [{ teams: 'Atlético Nacional vs Millonarios', pick: 'local', odd: 2.1, amount: 400000 }],
              montoTotal: 400000,
              cuotaCombinada: 2.1,
              gananciaPotencial: 840000,
              estado: 'Pendiente',
            },
            {
              id: 'bet-ganada-bajo',
              fecha: '2026-07-05T10:00:00.000Z',
              selecciones: [{ teams: 'Boca Juniors vs River Plate', pick: 'visitante', odd: 1.8, amount: 100000 }],
              montoTotal: 100000,
              cuotaCombinada: 1.8,
              gananciaPotencial: 180000,
              estado: 'Ganada',
            },
            {
              id: 'bet-pendiente-medio',
              fecha: '2026-07-04T10:00:00.000Z',
              selecciones: [{ teams: 'América de Cali vs Deportivo Cali', pick: 'local', odd: 2.4, amount: 250000 }],
              montoTotal: 250000,
              cuotaCombinada: 2.4,
              gananciaPotencial: 600000,
              estado: 'Pendiente',
            },
            {
              id: 'bet-perdida-minimo',
              fecha: '2026-07-03T10:00:00.000Z',
              selecciones: [{ teams: 'Flamengo vs Palmeiras', pick: 'empate', odd: 3.2, amount: 50000 }],
              montoTotal: 50000,
              cuotaCombinada: 3.2,
              gananciaPotencial: 160000,
              estado: 'Perdida',
            },
          ])
        );
      });
      await page.reload();

      // El heading confirma que estamos en history.html.
      // Las filas de datos aparecen dentro de tbody; por eso excluimos el header de la tabla.
      await expect(page.getByRole('heading', { name: 'Historial de Apuestas' })).toBeVisible();
      await expect(page.locator('#historyBody tr')).toHaveCount(4);
    });

    // When: filtrar por estado Pendiente.
    await test.step('When filtra por estado Pendiente', async () => {
      const statusFilter = page.getByRole('combobox').nth(0);

      await statusFilter.selectOption('Pendiente');

      // Criterio 1: solo deben quedar filas con estado Pendiente.
      await expect(page.locator('#historyBody tr')).toHaveCount(2);
      await expect(page.locator('#historyBody .status')).toHaveText(['Pendiente', 'Pendiente']);
    });

    // When: ordenar por Mayor monto.
    await test.step('When ordena las apuestas por Mayor monto', async () => {
      const sortFilter = page.getByRole('combobox').nth(1);

      await sortFilter.selectOption('monto-desc');

      // Criterio 2: con el filtro Pendiente activo, los montos deben ir de mayor a menor.
      await expect(page.locator('#historyBody tr').nth(0)).toContainText('COP 400.000');
      await expect(page.locator('#historyBody tr').nth(1)).toContainText('COP 250.000');
    });

    // When: buscar por nombre de equipo.
    await test.step('When busca por nombre de equipo', async () => {
      // Limpiamos el filtro de estado para que la busqueda pruebe el criterio por si misma.
      await page.getByRole('combobox').nth(0).selectOption('');
      await page.getByPlaceholder('Buscar por equipo o liga...').fill('Boca');

      // Criterio 3: solo debe aparecer la apuesta cuyo equipo coincide con la busqueda.
      await expect(page.locator('#historyBody tr')).toHaveCount(1);
      await expect(page.locator('#historyBody tr').first()).toContainText('Boca Juniors vs River Plate');
      await expect(page.locator('#historyBody tr').first()).toContainText('Ganada');
    });
  });

  test('HU-05: Agregar eventos al ticket usando drag and drop', async ({ page }) => {
    // Given: abrir la pagina de eventos con el ticket lateral vacio.
    // Esta HU no usa clics sobre cuotas; valida el flujo alternativo de arrastrar una card.
    await test.step('Given que el apostador esta en el catalogo de eventos con el ticket vacio', async () => {
      await page.goto(betUrl);
      await page.evaluate((balance) => {
        localStorage.setItem('qaxbet_wallet', JSON.stringify({ balance, currency: 'COP' }));
        localStorage.setItem('qaxbet_bets', JSON.stringify([]));
        localStorage.setItem('qaxbet_history', JSON.stringify([]));
      }, initialBalance);
      await page.reload();

      await expect(page.getByRole('heading', { name: /Eventos en Vivo/ })).toBeVisible();
      await expect(page.locator('.event-card')).toHaveCount(8);
      await expect(page.locator('#ticketSidebar .ticket-empty')).toBeVisible();
      await expect(page.getByRole('button', { name: /Ir a Apostar/ })).toBeDisabled();
    });

    // When: arrastrar el primer evento hacia el ticket lateral.
    // .event-card y #ticketSidebar son CSS porque el DOM no expone roles accesibles especificos para drag and drop.
    await test.step('When arrastra un evento al ticket lateral', async () => {
      const firstEvent = page.locator('.event-card').first();
      const ticketSidebar = page.locator('#ticketSidebar');
      const eventName = await firstEvent.locator('.event-teams').textContent();
      const localOdd = await firstEvent.locator('[data-pick="local"]').getAttribute('data-odd');

      await firstEvent.dragTo(ticketSidebar);

      // Criterio 1: el evento arrastrado debe agregarse automaticamente al ticket.
      await expect(page.locator('#ticketSidebar .ticket-item')).toHaveCount(1);
      await expect(page.getByRole('button', { name: /Ir a Apostar/ })).toBeEnabled();

      // Criterio 2: el ticket debe mostrar el evento y la cuota local tomada por el drop.
      await expect(page.locator('#ticketSidebar .ticket-item')).toContainText(eventName?.trim() || '');
      await expect(page.locator('#ticketSidebar .pick-odd')).toHaveText(Number(localOdd).toFixed(2));
    });

    // And: arrastrar un segundo evento para validar el recalculo de cuota combinada.
    await test.step('And arrastra un segundo evento para recalcular las odds combinadas', async () => {
      const firstOdd = Number(await page.locator('#ticketSidebar .pick-odd').first().textContent());
      const secondEvent = page.locator('.event-card').nth(1);
      const secondOdd = Number(await secondEvent.locator('[data-pick="local"]').getAttribute('data-odd'));

      await secondEvent.dragTo(page.locator('#ticketSidebar'));

      // Criterio 3: al agregar otro evento por arrastre, la cuota combinada se recalcula.
      const expectedCombinedOdds = (firstOdd * secondOdd).toFixed(2);

      await expect(page.locator('#ticketSidebar .ticket-item')).toHaveCount(2);
      await expect(page.locator('#combinedOdds')).toHaveText(expectedCombinedOdds);
    });
  });
});
