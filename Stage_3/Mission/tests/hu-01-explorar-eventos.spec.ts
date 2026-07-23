import { test } from '@playwright/test';
import { EventsPage } from '../pages/EventsPage.js';

test.describe('HU-01: Explorar eventos', () => {
  let eventsPage: EventsPage;

  // Bloque de preparacion:
  // Crea un Page Object nuevo y abre la pagina principal antes de cada caso
  // para que los escenarios sean independientes entre si.
  test.beforeEach(async ({ page }) => {
    eventsPage = new EventsPage(page);
    await eventsPage.openEvents();
  });

  test('muestra 6 eventos con nombre, fecha, lugar y precio', async () => {
    // Bloque de verificacion:
    // Valida la cantidad total y la informacion obligatoria solicitada por el
    // primer criterio de aceptacion de la HU-01.
    await eventsPage.verifySixEventsWithRequiredInformation();
  });

  test('filtra los eventos de Futbol y resalta el filtro activo', async () => {
    // Bloque de accion:
    // Aplica el filtro desde la interfaz tal como lo haria el usuario.
    await eventsPage.filterBy('Futbol');

    // Bloque de verificacion:
    // Comprueba tanto el resultado funcional del filtro como su estado visual
    // activo, cubriendo ambos criterios de aceptacion relacionados.
    await eventsPage.verifyOnlyFootballEventsAreVisible();
    await eventsPage.verifyFilterIsVisuallyActive('Futbol');
  });

  test('navega a la seleccion de asientos desde Comprar Entradas', async () => {
    // Bloque de datos:
    // Usa un evento real y unico de la categoria Futbol para que la accion no
    // dependa de la posicion de una tarjeta dentro del listado.
    const eventTitle = 'Colombia vs Argentina';

    // Bloque de accion:
    // Inicia la compra desde la tarjeta especifica del evento seleccionado.
    await eventsPage.buyTicketsFor(eventTitle);

    // Bloque de verificacion:
    // Confirma la URL de destino y que la pantalla de asientos conserva el
    // evento elegido, demostrando que la navegacion fue correcta.
    await eventsPage.verifySeatSelectionFor(eventTitle);
  });
});
