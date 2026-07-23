import { test } from '@playwright/test';
import { CheckoutPage, type BuyerData, type CardData } from '../pages/CheckoutPage.js';
import { EventsPage } from '../pages/EventsPage.js';
import { SeatsPage } from '../pages/SeatsPage.js';
import { TicketsPage } from '../pages/TicketsPage.js';

test.describe('HU-03: Checkout y pago con iframe', () => {
  let checkoutPage: CheckoutPage;
  let ticketsPage: TicketsPage;

  // Bloque de datos:
  // Utiliza informacion valida y deterministica para que todos los escenarios
  // prueben las mismas reglas sin depender de valores externos.
  const buyer: BuyerData = {
    name: 'Laura Martinez',
    email: 'laura.martinez@example.com',
    phone: '3001234567',
  };
  const validCard: CardData = {
    number: '4111111111111111',
    expiry: '12/30',
    cvv: '123',
    holderName: 'Laura Martinez',
  };
  const expectedTotal = 720_000;

  // Bloque de preparacion:
  // Recorre eventos y asientos antes de cada prueba para crear una orden real.
  // Math.random se controla para evitar que el rechazo aleatorio vuelva
  // inestable la validacion del camino exitoso.
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      Math.random = () => 0.1;
    });

    const eventsPage = new EventsPage(page);
    const seatsPage = new SeatsPage(page);
    checkoutPage = new CheckoutPage(page);
    ticketsPage = new TicketsPage(page);

    await eventsPage.openEvents();
    await eventsPage.buyTicketsFor('Colombia vs Argentina');
    await seatsPage.waitUntilLoaded();
    await seatsPage.selectFirstFreeSeats(2);
    await seatsPage.continueToCheckout();
    await checkoutPage.waitUntilLoaded();
  });

  test('solicita nombre, correo y telefono obligatorios', async () => {
    // Bloque de verificacion:
    // Comprueba la presencia y el estado required de los tres campos.
    await checkoutPage.verifyRequiredBuyerFields();
  });

  test('activa el iframe de pago con el total correcto', async () => {
    test.info().annotations.push({
      type: 'Integracion iframe',
      description: 'El checkout envia el total de la orden a la pasarela.',
    });

    // Bloques de accion y verificacion:
    // Envia los datos y compara el total del checkout con el mostrado dentro
    // del iframe.
    await checkoutPage.submitBuyerDataAsUser(buyer);
    await checkoutPage.verifyPaymentActivatedWithTotal(expectedTotal);
  });

  test('valida numero de tarjeta, vencimiento y CVV dentro del iframe', async () => {
    // Bloques de preparacion y verificacion:
    // Activa la pasarela e intenta pagar con valores incompletos para comprobar
    // sus restricciones y mensajes de error.
    await checkoutPage.activatePaymentForTest(buyer);
    await checkoutPage.verifyCardFieldRequirements();
  });

  test('muestra confirmacion al procesar un pago exitoso', async () => {
    test.info().annotations.push({
      type: 'Pago exitoso',
      description: 'La pasarela confirma el pago antes de redirigir al usuario.',
    });

    // Bloques de accion y verificacion:
    // Procesa una tarjeta valida y espera el mensaje transitorio de exito.
    await checkoutPage.activatePaymentForTest(buyer);
    await checkoutPage.fillCard(validCard);
    await checkoutPage.processPayment();
    await checkoutPage.verifySuccessfulPaymentMessage();
  });

  test('genera un ID de reserva con formato TKT-XXXXXXXXXX', async ({ page }) => {
    test.info().annotations.push({
      type: 'Regla de negocio',
      description: 'La reserva debe usar TKT- seguido de diez digitos.',
    });

    // Bloques de accion y verificacion:
    // Completa el pago, espera la pagina final y valida estrictamente el ID.
    await checkoutPage.activatePaymentForTest(buyer);
    await checkoutPage.fillCard(validCard);
    await checkoutPage.processPayment();
    await checkoutPage.verifySuccessfulPaymentMessage();
    await page.waitForURL(/\/tickets\.html$/);
    await ticketsPage.verifyBookingIdFormat();
  });

  test('redirige al usuario a la pagina Mis Entradas', async ({ page }) => {
    // Bloques de accion y verificacion:
    // Completa el flujo y confirma URL, encabezado y ticket visible.
    await checkoutPage.activatePaymentForTest(buyer);
    await checkoutPage.fillCard(validCard);
    await checkoutPage.processPayment();
    await checkoutPage.verifySuccessfulPaymentMessage();
    await page.waitForURL(/\/tickets\.html$/);
    await ticketsPage.verifyUserWasRedirected();
  });
});
