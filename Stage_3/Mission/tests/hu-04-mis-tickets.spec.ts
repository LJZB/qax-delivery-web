import { test } from '@playwright/test';
import {
  TicketsPage,
  type TicketBooking,
} from '../pages/TicketsPage.js';

test.describe('HU-04: Mis tickets', () => {
  let ticketsPage: TicketsPage;

  // Bloque de datos:
  // Prepara dos reservas y tres entradas con valores conocidos para validar
  // tarjetas, fechas, códigos QR y totales sin depender del pago de HU-03.
  const bookings: TicketBooking[] = [
    {
      id: 'TKT-1234567890',
      event: {
        eventName: 'Colombia vs Argentina',
        eventDate: '2026-08-22',
        eventVenue: 'Estadio Metropolitano, Barranquilla',
        seats: [
          { id: 'V1-1', zone: 'VIP', price: 120_000 },
          { id: 'V1-2', zone: 'VIP', price: 120_000 },
        ],
        total: 240_000,
      },
      purchaseDate: '2026-07-21T15:00:00-05:00',
    },
    {
      id: 'TKT-0987654321',
      event: {
        eventName: 'Concierto Karol G',
        eventDate: '2026-10-12',
        eventVenue: 'Movistar Arena, Bogota',
        seats: [{ id: 'G1-3', zone: 'General', price: 220_000 }],
        total: 220_000,
      },
      purchaseDate: '2026-07-22T10:00:00-05:00',
    },
  ];

  // Bloque de preparacion:
  // Crea un Page Object nuevo para mantener cada escenario independiente.
  test.beforeEach(async ({ page }) => {
    ticketsPage = new TicketsPage(page);
  });

  test('muestra tarjetas con los tickets comprados', async () => {
    // Bloques de accion y verificacion:
    // Abre la pagina con dos reservas y comprueba ambas tarjetas.
    await ticketsPage.openWithBookings(bookings);
    await ticketsPage.verifyPurchasedTicketCards(2);
  });

  test('muestra evento, ID y fecha de compra en cada ticket', async () => {
    test.info().annotations.push({
      type: 'Contenido del ticket',
      description: 'Cada entrada identifica la reserva, el evento y la compra.',
    });

    // Bloque de verificacion:
    // Valida individualmente los datos visibles de las dos reservas.
    await ticketsPage.openWithBookings(bookings);
    await ticketsPage.verifyTicketInformation(
      'TKT-1234567890',
      'Colombia vs Argentina',
      /21.*jul.*2026/i,
    );
    await ticketsPage.verifyTicketInformation(
      'TKT-0987654321',
      'Concierto Karol G',
      /22.*jul.*2026/i,
    );
  });

  test('renderiza un codigo QR SVG en cada ticket', async () => {
    test.info().annotations.push({
      type: 'Estado visual',
      description: 'Cada tarjeta debe renderizar su QR mediante un elemento SVG.',
    });

    // Bloque de verificacion:
    // Exige un SVG visible dentro de cada tarjeta generada.
    await ticketsPage.openWithBookings(bookings);
    await ticketsPage.verifyEachTicketHasQr(2);
  });

  test('resume total de entradas, eventos y gasto', async () => {
    // Bloque de verificacion:
    // Dos reservas contienen tres asientos y un gasto acumulado de 460.000 COP.
    await ticketsPage.openWithBookings(bookings);
    await ticketsPage.verifySummary(3, 2, 460_000);
  });

  test('muestra el estado vacio y permite volver a eventos', async () => {
    // Bloques de preparacion, accion y verificacion:
    // Abre Mis Entradas sin reservas, comprueba el mensaje y usa el control
    // disponible para regresar al catalogo de eventos.
    await ticketsPage.openWithBookings([]);
    await ticketsPage.verifyEmptyStateAndReturnToEvents();
  });
});
