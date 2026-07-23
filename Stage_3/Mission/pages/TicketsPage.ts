import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage.js';

export interface TicketSeat {
  id: string;
  zone: string;
  price: number;
}

export interface TicketBooking {
  id: string;
  event: {
    eventName: string;
    eventDate: string;
    eventVenue: string;
    seats: TicketSeat[];
    total: number;
  };
  purchaseDate: string;
}

export class TicketsPage extends BasePage {
  // Bloque de localizadores:
  // Centraliza las tarjetas, el resumen y el estado vacio para que los tests
  // no conozcan detalles de la estructura HTML.
  readonly pageHeading: Locator;
  readonly ticketCards: Locator;
  readonly firstTicketId: Locator;
  readonly totalTickets: Locator;
  readonly totalEvents: Locator;
  readonly totalSpent: Locator;
  readonly emptyState: Locator;
  readonly viewEventsButton: Locator;

  constructor(page: Page) {
    super(page);

    this.pageHeading = page.getByRole('heading', {
      name: 'Mis Entradas',
      exact: true,
    });
    this.ticketCards = page.locator('.ticket-card');
    this.firstTicketId = this.ticketCards.first().locator('.ticket-id');
    this.totalTickets = page.locator('#totalTickets');
    this.totalEvents = page.locator('#totalEvents');
    this.totalSpent = page.locator('#totalSpent');
    this.emptyState = page.locator('#emptyState');
    this.viewEventsButton = page.getByRole('button', {
      name: 'Ver Eventos',
      exact: true,
    });
  }

  // Bloque de localizadores dinamicos:
  // Obtiene una tarjeta especifica por su identificador de reserva.
  ticketCardById(ticketId: string): Locator {
    return this.ticketCards.filter({ hasText: ticketId });
  }

  // Bloque de preparacion:
  // Abre primero una pagina del mismo origen, establece reservas controladas
  // y navega a Mis Entradas. Esto aísla HU-04 del defecto de pago de HU-03.
  async openWithBookings(bookings: TicketBooking[]): Promise<void> {
    await this.open('index.html');
    await this.page.evaluate((storedBookings) => {
      localStorage.setItem(
        'qaxtickets_bookings',
        JSON.stringify(storedBookings),
      );
    }, bookings);

    await expect
      .poll(async () =>
        this.page.evaluate(() => {
          const stored = JSON.parse(
            localStorage.getItem('qaxtickets_bookings') ?? '[]',
          );
          return stored.length;
        }),
      )
      .toBe(bookings.length);

    await this.open('tickets.html');
    await expect(this.pageHeading).toBeVisible();
  }

  // Bloque de verificaciones:
  // Confirma la redireccion usada por HU-03 y los criterios visuales y
  // funcionales propios de HU-04.
  async verifyUserWasRedirected(): Promise<void> {
    await expect(this.page).toHaveURL(/\/tickets\.html$/);
    await expect(this.pageHeading).toBeVisible();
  }

  async verifyBookingIdFormat(): Promise<void> {
    await expect(this.ticketCards.first()).toBeVisible();
    await expect(this.firstTicketId).toHaveText(/^TKT-\d{10}$/);
  }

  async verifyPurchasedTicketCards(expectedCount: number): Promise<void> {
    await expect(this.ticketCards).toHaveCount(expectedCount);

    for (let index = 0; index < expectedCount; index += 1) {
      await expect(this.ticketCards.nth(index)).toBeVisible();
    }
  }

  async verifyTicketInformation(
    ticketId: string,
    eventName: string,
    purchaseDate: RegExp,
  ): Promise<void> {
    const ticketCard = this.ticketCardById(ticketId);

    await expect(ticketCard).toBeVisible();
    await expect(ticketCard.locator('.event-name')).toHaveText(eventName);
    await expect(ticketCard.locator('.ticket-id')).toHaveText(ticketId);

    const purchaseRow = ticketCard.locator('.ticket-info .row').filter({
      hasText: 'Comprado',
    });
    await expect(purchaseRow.locator('.val')).toHaveText(purchaseDate);
  }

  async verifyEachTicketHasQr(expectedCount: number): Promise<void> {
    await expect(this.ticketCards).toHaveCount(expectedCount);

    for (let index = 0; index < expectedCount; index += 1) {
      const qr = this.ticketCards.nth(index).locator('.ticket-qr svg');
      await expect(qr).toBeVisible();
    }
  }

  async verifySummary(
    expectedTickets: number,
    expectedEvents: number,
    expectedSpent: number,
  ): Promise<void> {
    await expect(this.totalTickets).toHaveText(String(expectedTickets));
    await expect(this.totalEvents).toHaveText(String(expectedEvents));
    await expect(this.totalSpent).toHaveText(
      `$${expectedSpent.toLocaleString('es-CO')}`,
    );
  }

  async verifyEmptyStateAndReturnToEvents(): Promise<void> {
    await expect(this.emptyState).toBeVisible();
    await expect(this.emptyState).toContainText(
      'No tienes entradas compradas',
    );
    await expect(this.ticketCards).toHaveCount(0);
    await expect(this.viewEventsButton).toBeVisible();

    await this.viewEventsButton.click();
    await expect(this.page).toHaveURL(/\/index\.html$/);
  }
}
