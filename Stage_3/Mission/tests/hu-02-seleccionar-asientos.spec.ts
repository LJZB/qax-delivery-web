import { test } from '@playwright/test';
import { EventsPage } from '../pages/EventsPage.js';
import { SeatsPage } from '../pages/SeatsPage.js';

test.describe('HU-02: Seleccionar asientos', () => {
  let eventsPage: EventsPage;
  let seatsPage: SeatsPage;

  // Bloque de preparacion:
  // Abre la aplicacion desde la pagina de eventos, selecciona un evento real
  // y llega a la pantalla de asientos antes de cada escenario independiente.
  test.beforeEach(async ({ page }) => {
    eventsPage = new EventsPage(page);
    seatsPage = new SeatsPage(page);

    await eventsPage.openEvents();
    await eventsPage.buyTicketsFor('Colombia vs Argentina');
    await seatsPage.waitUntilLoaded();
  });

  test('muestra las zonas VIP, Platea y General', async () => {
    // Bloque de anotacion:
    // Registra en el reporte la regla de negocio evaluada por el escenario.
    test.info().annotations.push({
      type: 'Regla de negocio',
      description: 'El mapa debe contener las tres zonas disponibles.',
    });

    // Bloque de verificacion:
    // Comprueba que cada zona tenga asientos y un rotulo visible para el usuario.
    await test.step('Validar las zonas del mapa', async () => {
      await seatsPage.verifyThreeZones();
    });
  });

  test('muestra los asientos libres en verde', async () => {
    // Bloque de anotacion:
    // Documenta el significado funcional del color verde en el reporte.
    test.info().annotations.push({
      type: 'Estado visual',
      description: 'El color verde representa un asiento libre.',
    });

    // Bloque de verificacion:
    // Valida el color definido por el criterio de aceptacion.
    await seatsPage.verifyFreeSeatColor();
  });

  test('muestra los asientos ocupados en rojo y no permite seleccionarlos', async () => {
    // Bloque de datos:
    // Define un asiento conocido para preparar de forma deterministica su estado.
    const occupiedSeat = { id: 'V1-1', zone: 'VIP', price: 360_000 };

    // Bloques de preparacion, verificacion y accion:
    // Crean la reserva, validan el estado ocupado e intentan modificarlo.
    await test.step('Preparar un asiento ocupado', async () => {
      await seatsPage.bookSeatForTest(
        occupiedSeat.id,
        occupiedSeat.zone,
        occupiedSeat.price,
      );
    });

    await test.step('Validar el estado visual del asiento ocupado', async () => {
      await seatsPage.verifyOccupiedSeatState(occupiedSeat.id);
    });

    await test.step('Intentar seleccionar el asiento ocupado', async () => {
      await seatsPage.tryToSelectOccupiedSeat(occupiedSeat.id);
      await seatsPage.verifyOccupiedSeatWasNotSelected(occupiedSeat.id);
    });
  });

  test('cambia un asiento libre a dorado al seleccionarlo', async () => {
    // Bloques de accion y verificacion:
    // Selecciona un asiento disponible y comprueba su nuevo estado visual.
    const seatId = await seatsPage.selectFirstFreeSeat();
    await seatsPage.verifySeatIsSelected(seatId);
  });

  test('impide seleccionar mas de cuatro asientos y muestra una advertencia', async () => {
    // Bloque de anotacion:
    // Registra el limite maximo permitido por una compra.
    test.info().annotations.push({
      type: 'Limite',
      description: 'Una compra admite como maximo cuatro asientos.',
    });

    // Bloques de accion y verificacion:
    // Completa el cupo, intenta agregar un quinto asiento y valida el rechazo.
    await seatsPage.selectFirstFreeSeats(4);
    await seatsPage.selectFirstFreeSeat();
    await seatsPage.verifyMaximumSelectionWarning();
  });

  test('muestra los asientos seleccionados con precio y total', async () => {
    // Bloques de accion y verificacion:
    // Selecciona dos asientos y valida el detalle monetario del panel flotante.
    await seatsPage.selectFirstFreeSeats(2);
    await seatsPage.verifySummaryForSelectedSeats(2);
    await seatsPage.verifyContinueButtonIsEnabled();
  });

  test('mantiene deshabilitado Continuar a Pago cuando no hay asientos', async () => {
    // Bloque de anotacion:
    // Conserva en el reporte la desviacion observada respecto al criterio.
    test.info().annotations.push({
      type: 'Defecto conocido',
      description:
        'El SUT oculta el panel, pero el boton no incluye disabled inicialmente.',
    });

    // Bloque de verificacion:
    // Exige el estado esperado aunque actualmente el SUT incumpla el criterio.
    await seatsPage.verifyContinueButtonIsDisabledWithoutSeats();
  });
});
